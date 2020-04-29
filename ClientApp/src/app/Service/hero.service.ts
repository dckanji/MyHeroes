import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from '../Models/hero';
import { MessageService } from './message.service';

//@Injectable 装饰器会接受该服务的元数据对象，就像 @Component() 对组件类的作用一样
//代表这个类将被注入到根module中。 root(根) / platform(共享平台) / any()
@Injectable({ providedIn: 'root' })
export class HeroService {

  //heroesURL 定义为 :base/:collectionName 的形式。 
  //这里的 base(api指的是虛擬服務器 web api) 是要请求的资源，而 collectionName(memheroes) 是 in-memory-data-service.ts 中的英雄数据对象
  private heroesUrl = 'api/memheroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  //建構子-添加私有的 messageService，其类型为 MessageService 
  //添加私有的 http，其类型为 HttpClient
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  /** GET heroes from the server 
   * 回傳來自服務端的英雄列表
   * 回傳 Observable 類型物件..透過 HttpClient.get 方法来获取英雄数据
   * Observable 是 RxJS 库中的一个关键类。
   * 呼叫方可透過 Observable.subscribe() 進行獲取
   *  
  */
  getHeroes (): Observable<Hero[]> {
    //HttpClient 方式(http.get)回傳
    return this.http.get<Hero[]>(this.heroesUrl) 
      .pipe(
        tap(_ => this.log('fetched heroes')), //透過 log方法 寫入到訊息組件
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }


  /** GET hero by id. Will 404 if id not found 
   * 依照id回傳來自服務端的英雄資料
   * 反引号 ( ` ) 用于定义 JavaScript 的 模板字符串字面量，以便嵌入 id
  */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`; // api/heroes/11
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T); //使用 RxJS 的 of() 函数回傳
    };
  }

  /** 
   * 透過 HeroService 寫入 訊息 緩存 裡面..顯示在訊息組件中
   * Log a HeroService message with the MessageService 
  */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
