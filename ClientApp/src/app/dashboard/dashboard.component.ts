import { Component, OnInit } from '@angular/core';
import { Hero } from '../Models/hero';
import { HeroService } from '../Service/hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }
  /**
   * 透過 heroService.getHeroes 獲取英雄列表資料
   * slice 返回陣列中的前四個頂層英雄
   */
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
}
