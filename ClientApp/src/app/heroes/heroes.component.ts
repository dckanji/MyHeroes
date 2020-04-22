import { Component, OnInit } from '@angular/core';

import { Hero } from '../Models/hero';//引入類別組件
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'] //app-heroes 用来在父组件的模板中匹配 HTML 元素的名称，以识别出该组件
})

export class HeroesComponent implements OnInit {
  //宣告英雄名稱陣列物件
  heroes: Hero[];

  //建構子
  constructor(private heroService: HeroService) { }

  //lifecycle hook 生命周期钩子..Angular 在创建完组件后很快就会调用 ngOnInit()。这里是放置初始化逻辑的好地方。
  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
