import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule} from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from './app.component';
import { EImgComponent } from './html-elements/e-img/e-img.component';
import { ETxtComponent } from './html-elements/e-txt/e-txt.component';
import { EVidComponent } from './html-elements/e-vid/e-vid.component';

@NgModule({
  declarations: [
    AppComponent,
    EImgComponent,
    ETxtComponent,
    EVidComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
