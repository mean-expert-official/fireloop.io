import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SDKBrowserModule } from '../app/shared/sdk/index';

import {
  isBrowser,
  UniversalModule,
  platformUniversalDynamic
} from 'angular2-universal/browser';

import { AppComponent } from '../app/app.component';


export const platform = platformUniversalDynamic();

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [
    UniversalModule,
    FormsModule,
    SDKBrowserModule.forRoot()
  ],
  providers: [

  ]
})
export class MainModule {
}

export function main() {

  console.log('isBrowser', isBrowser);
  // browserPlatform bootstrap
  return platform.bootstrapModule(MainModule);
}
