import * as path from 'path';
import * as fs from 'fs';
import { ResourceLoader } from "@angular/compiler";

export class FileSystemResourceLoader extends ResourceLoader {
    resolve(url: string, baseUrl: string): string {
        //Angular assembles absolute URL's and prefixes them with //
        if (url.indexOf("/") !== 0) {
            //Resolve relative URL's based on the app root.
            return path.join(baseUrl, 'app', url);
        } else {
            return url;
        }
    }

    get(url: string): Promise<string> {
        const appDir = path.join(__dirname);
        const templatePath = this.resolve(url, appDir);

        return new Promise((resolve, reject) => {
            fs.readFile(templatePath, 'utf8', (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    }
}