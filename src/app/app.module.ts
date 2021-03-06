import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

/**
 * firebase modules
 */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

/**
 * NgRx modules
 */
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

/**
 * Reducers and Effects
 */
import {
  AppInitService,
  Auth,
  Loading,
  PageHeader,
  CloudRouter,
  CustomerReducer,
  Sidebar,
  SidebarEffects,
  CustomerEffects,
  UserReducer,
  UserEffects,
  Utils,
  RouterEffects
} from '@angular-cm/sys-utils';

/**
 * forms and formly modules
 */
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

/**
 * library modules (src/libs/**)
 */
import { UiAuthModule } from '@angular-cm/ui-auth';
import { UiCommonModule } from '@angular-cm/ui-common';
import { UiGlobalModule } from '@angular-cm/ui-global';
import { UiContentModule } from '@angular-cm/ui-content';
import { UiMaterialModule } from '@angular-cm/ui-material';
import {
  UiFormlyModule,
  CmValidatorsMap,
  CmValidationMessages
} from '@angular-cm/ui-formly';

/**
 * components imports and others
 */
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AuthEffects } from 'src/libs/sys-utils/ngrx/auth/auth.effects';

/**
 **** This function is used as initializer for APP_INITIALIZER
      (to set environment service before bootstraping the app)
 */
function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => appInitService.init();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    StoreModule.forRoot({
      auth: Auth,
      customer: CustomerReducer,
      loading: Loading,
      sidebar: Sidebar,
      pageHeader: PageHeader,
      router: CloudRouter,
      user: UserReducer,
      utils: Utils
    }),
    EffectsModule.forRoot([
      AuthEffects,
      CustomerEffects,
      SidebarEffects,
      RouterEffects,
      UserEffects
    ]),
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validators: CmValidatorsMap,
      validationMessages: CmValidationMessages
    }),
    FormlyMaterialModule,
    UiAuthModule,
    UiGlobalModule,
    UiContentModule,
    UiCommonModule,
    UiMaterialModule,
    UiFormlyModule
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
