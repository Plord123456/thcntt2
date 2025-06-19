import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard';
import {LoginComponent} from './pages/login/login';
import {NgModule} from '@angular/core';
import {EmployeeManagementComponent} from './pages/employee-management/employee-management';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'employee-management',
    loadComponent: () => import('./pages/employee-management/employee-management').then(m => m.EmployeeManagementComponent)
  }, // <-- Add this comma
  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
