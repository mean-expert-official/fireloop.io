import './polyfills.node';

import * as path from 'path';
import * as express from 'express';

import { enableProdMode } from '@angular/core';
import { createEngine } from 'angular2-express-engine';
/** 
 * Fix for Tempalte URL Issues on Angular Universal
 * https://github.com/angular/universal/issues/579
 **/
import { FileSystemResourceLoader } from './resource-loader';
import { ResourceLoader } from '@angular/compiler';
import { platformNodeDynamic } from 'angular2-universal/node';
/*End of Fix Imports*/
// Angular 2 Universal
enableProdMode();
import { MainModule } from './app.node.module';
// Not sure if it will be a LoopBack or Express instance
let app: any;
// LoopBack
if (process.env.LOOPBACK) {
  app = require(path.resolve(__dirname, '..', '..', 'server', 'server'));
} else {
  // Stand Alone Express
  app = express();
}

const ROOT = path.join(path.resolve(__dirname, '..'));
const start = () => {
    if (app.start) {
        app.start();
    } else {
        app.listen(3000, () => {
            console.log('Listening on: http://localhost:3000');
        });
    }
};

// Express View
app.engine('.html', createEngine({
  ngModule : MainModule,
  time     : true,
  platform : (extraProviders: any) => {
        let platform = platformNodeDynamic(extraProviders);
        (<any> platform).cacheModuleFactory_old = platform.cacheModuleFactory;
        platform.cacheModuleFactory = (moduleType: any, compilerOptions?: any): Promise<any> => {
            if (!compilerOptions) {
                compilerOptions = {
                    providers: [
                        {provide: ResourceLoader, useClass: FileSystemResourceLoader}
                    ]
                };
            }
            return (<any> platform).cacheModuleFactory_old(moduleType, compilerOptions);
        };
        return platform;
    }
}));

app.set('views', path.join(__dirname, '..'));
app.set('view engine', 'html');

// Serve static files
app.use(express.static(ROOT, { index: false }));

app.get('/', function (req: any, res: any, next: Function) {
  res.render('index', {
    time: true,
    req,
    res,
    originUrl: 'http://localhost:3000',
    baseUrl: '/',
    requestUrl: '/',
    preboot: { appRoot: ['app-root'], uglify: true },
  });
});

start();