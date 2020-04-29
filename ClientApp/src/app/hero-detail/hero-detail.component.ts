import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../Models/hero';
import { HeroService }  from '../Service/hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  //hero 属性必须是一个带有 @Input() 装饰器的输入属性，因为外部的 HeroesComponent 组件将会绑定到它。
  //@input的作用是定义模块输入，用来接收來自父组件(heroes.component)传递的 物件或值
  // 父組件設定值的語法為 <app-hero-detail [hero]="selectedHero"></app-hero-detail>
  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute, //ActivatedRoute 保存着到这个 HeroDetailComponent 实例的路由信息
    private heroService: HeroService, //从服务获取英雄数据，本组件将使用它来获取要显示的英雄
    private location: Location //是一个 Angular 的服务，用来与浏览器打交道 稍后，你就会使用它来导航回上一个视图
  ) {}

  //初始化
  ngOnInit(): void {
    
    this.getHero();
  }

/**
 * 透過 路由快照 中取得 id參數 並獲取hero的物件...參數一般常為字串
 * route.snapshot 是一个路由信息的静态快照，抓取自组件刚刚创建完毕之后
 * paramMap 是一个从 URL 中提取的路由参数值的字典。 "id" 对应的值就是要获取的英雄的 id
 * 
 */
  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    //kanji add 20200427 判斷id是否存在..若存在則使用id獲取hero物件...否則首次點擊回傳空值
    if (id){
      this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
    }
  }

  /**
   * 回上一層
   */
  goBack(): void {
    this.location.back();
  }

/**
 * 存檔
 */
 save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
}
