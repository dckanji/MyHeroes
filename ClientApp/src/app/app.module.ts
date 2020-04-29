import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
//根組件
import { AppComponent } from './app.component';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

//以下皆來自heroes 範例中的組件
import { AppRoutingModule }     from './app-routing.module'; //路由組件

//为了在没有服务端的情况下提前运行和调试angular项目,需要一个构建在内存中的模拟数据库,和对应的api
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'; 
import { InMemoryDataService }  from './in-memory-data.service';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroSearchComponent }  from './hero-search/hero-search.component';
import { MessagesComponent }    from './messages/messages.component';



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ]),
    // 引用路由模塊
    AppRoutingModule,
    /* The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // 为了在没有服务端的情况下提前运行和调试angular项目,需要一个构建在内存中的模拟数据库,和对应的api
    // 内存 Web API(In-memory Web API)模拟出的远程数据服务器通讯, 操作一个内存数据库，并且给出仿真的响应
    forRoot() 配置方法接收一个 InMemoryDataService 类来初始化内存数据库
     InMemoryDataService 檔案為 in-memory-data.service.ts 
    */
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
