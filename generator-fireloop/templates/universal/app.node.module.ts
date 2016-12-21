import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniversalModule, createGlobalProxy } from 'angular2-universal/node';
import { SDKNodeModule } from '../app/shared/sdk/index';
import { AppComponent} from '../app/app.component';


@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [
    UniversalModule,
    FormsModule,
    SDKNodeModule.forRoot()
  ],
  providers: []
})

export class MainModule {
  constructor() {
    createGlobalProxy();
  }
}
