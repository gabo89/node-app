import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputUserDataFormComponent } from './input-user-data-form/input-user-data-form.component';
import { DisplayUserDataComponent } from './display-user-data/display-user-data.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { IndexFormComponent } from './index-form/index-form.component';
import { RecoverFormComponent } from './recover-form/recover-form.component';
import { RecoverFormSuccessComponent } from './recover-form-success/recover-form-success.component';

const routes: Routes = [
 {
    path: '',
    component: LoginFormComponent
  },
  {
    path: 'register',
    component: InputUserDataFormComponent
  },
  {
    path: 'index',
    component: IndexFormComponent
  },
  {
    path: 'recover',
    component: RecoverFormComponent
  },
  {
    path: 'user/:id',
    component: DisplayUserDataComponent
  },
   {
    path: 'sent/:id',
    component: RecoverFormSuccessComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
