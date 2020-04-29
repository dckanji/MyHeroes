/**
 * 在 Angular 中，最好在一个独立的顶层模块中加载和配置路由器，它专注于路由功能，然后由根模块 AppModule 导入它
 *  AppRoutingModule 会导入RouterModule 和 Routes，以便该应用具有路由功能
 */

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';


/** 路由連接 
 * path: 用来匹配浏览器地址栏中 URL 的字符串
 * component: 导航到该路由时，路由器应该创建的组件
 * 类似于 localhost:4200/heroes 就显示 HeroesComponent。
*/
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },//預設路由
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },//將英雄的id傳入...:id表示佔位符號
  { path: 'heroes', component: HeroesComponent }
];

/**
 * 将 RouterModule 添加到 AppRoutingModule 的 imports 数组中，
 * 同时通过调用 RouterModule.forRoot() 来用这些 routes 配置它
 * 
 * forRoot() 之所以這樣命名，是因为你要在应用的顶层配置这个路由器
 * forRoot() 方法会提供路由所需的服务提供者和指令，还会基于浏览器的当前 URL 执行首次导航。
 * 
 * exports: AppRoutingModule 导出 RouterModule，以便它在整个应用程序中生效。
 */
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
