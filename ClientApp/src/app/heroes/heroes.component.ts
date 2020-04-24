import { Component, OnInit } from '@angular/core';

import { Hero } from '../Models/hero';//引入類別組件
import { HeroService } from '../Service/hero.service';
import { MessageService } from '../Service/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'] //app-heroes 用来在父组件的模板中匹配 HTML 元素的名称，以识别出该组件
})

export class HeroesComponent implements OnInit {
  //宣告英雄名稱陣列物件
  heroes: Hero[];
  
  selectedHero: Hero;

  //建構子-添加一个私有的 heroService，其类型为 HeroService
  //这个参数同时做了两件事：1. 声明了一个私有 heroService 属性，2. 把它标记为一个 HeroService 的注入点
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  //lifecycle hook 生命周期钩子..Angular 在创建完组件后很快就会调用 ngOnInit()。
  //这里是放置初始化逻辑的好地方。
  ngOnInit() {
    this.getHeroes();
  }

  /**
   * 透過 heroService.getHeroes 獲取英雄列表資料
   */
  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  /**
   * 新增英雄
   * @param name 
   */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
/**
 * 刪除英雄
 * @param hero 
 */
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  /**
   * 前端觸發選擇
   * @param hero 
   */
  getDetail(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`Heroes主組件上的訊息輸出: 選擇的英雄ID=${hero.id} 名稱=${hero.name}`);
  }


}
