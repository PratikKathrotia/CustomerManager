import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LoginForm } from '@angular-cm/ui-formly';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  ActionTypes,
  AlertConfig,
  AuthSelectors,
  AuthService,
  AuthState,
  GetUserInfo,
  Go,
  SetAuthStatus,
  ResetAuthState,
  VariantTypes,
  User,
  UserSelectors,
  EnvironmentService,
  ShowLoading,
  HideLoading,
  ToggleSidebaVisibility,
  ToolbarScope,
  SetToolbarScope,
  ResetPageHeader,
  ResetUserState
} from '@angular-cm/sys-utils';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material';

import {
  EmailVerificationDialogComponent
} from '../email-verification-dialog/email-verification-dialog.component';
import {
  ForgotPasswordDialogComponent
} from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  alertConfig: AlertConfig;
  hasError: boolean;
  form: FormGroup;
  formFields: FormlyFieldConfig[];
  model: any;

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private loginForm: LoginForm,
    private store: Store<any>
  ) { }

  ngOnInit() {
    this.loginForm.initializeForm({});
    this.form = new FormGroup(this.loginForm.initFormControls());
    this.formFields = this.loginForm.getForm();
    this.model = {};
    this.hasError = false;
    this.authService.logoutCurrentUser().then(success => {
      this.store.dispatch(new ResetAuthState());
      this.dispatchActions();
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      this.store.dispatch(new ShowLoading());
      this.authService.loginExistingUser(
        this.model.email,
        this.model.password
      ).then(success => {
        this.handleLoginSeccess();
      }).catch(error => {
        this.handleLoginError(error);
      });
    }
  }

  handleForgotPassword(): void {
    this.dialog.open(
      ForgotPasswordDialogComponent
    ).afterClosed().subscribe((action) => {
      if (action && action === ActionTypes.OK) {
        this.resetComponent();
      }
    });
  }

  handleLoginError(error: any): void {
    this.alertConfig = {
      variant: VariantTypes.ERROR,
      message: error.message
    };
    this.hasError = true;
    this.store.dispatch(new HideLoading());
  }

  handleLoginSeccess(): void {
    const payload: AuthState = {
      isLoggedIn: true,
      isEmailVerified: this.afAuth.auth.currentUser.emailVerified,
      currentUid: this.afAuth.auth.currentUser.uid
    };
    this.store.dispatch(new SetAuthStatus(payload));
  }

  openEmailVerificationDialog(): void {
    this.dialog.open(
      EmailVerificationDialogComponent
    ).afterClosed().subscribe(() => this.resetComponent());
  }

  resetComponent(): void {
    this.authService.logoutCurrentUser().then(success => {
      this.form.reset();
      this.model = {};
    });
  }

  dispatchActions(): void {
    this.store.dispatch(new ResetAuthState());
    this.store.dispatch(new ResetUserState());
    this.store.dispatch(new ToggleSidebaVisibility(false));
    this.store.dispatch(new SetToolbarScope(ToolbarScope.AUTH_LEVEL));
    this.store.dispatch(new ResetPageHeader());
    this.listen();
  }

  listen(): void {
    this.subscribeAuthStatus();
    this.subscribeUserDetails();
    this.subscribeUserError();
  }

  subscribeAuthStatus(): void {
    this.store.pipe(
      select(AuthSelectors.selectLoginStatus)
    ).subscribe(login => {
      if (sessionStorage.getItem('userToken')) {
        this.store.dispatch(new GetUserInfo(this.afAuth.auth.currentUser.uid));
      }
    });
  }

  subscribeUserDetails(): void {
    this.store.pipe(
      select(UserSelectors.selectUser)
    ).subscribe((user: User) => {
      if (user) {
        this.store.dispatch(new HideLoading());
        this.store.dispatch(
          new Go({
            path: ['global/customers']
          })
        );
      }
    });
  }

  subscribeUserError(): void {
    this.store.pipe(
      select(UserSelectors.selectUserError)
    ).subscribe(state => {
      if (state.hasError) {
        console.log(state.error);
      }
    });
  }

}
