import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from '@pages/home/home.page';

const routes: Routes = [
{
  path:'',
  redirectTo:'/home',
  pathMatch:'full'
},
{
  path: 'home',
  component: HomePage
},
{
  path:'**',
  redirectTo:'/home', //TODO:404 page
  pathMatch:'full'
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
