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
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    
    this.getHero();
  }

/**
 * 透過session 中的 id 獲取hero的物件
 */
  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    // 判斷id是否存在..若存在則使用id獲取hero物件
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
