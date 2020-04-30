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
        tap(_ => this.log('fetched heroes')), 
        // RxJS 的 tap() 操作符来实现-该操作符会查看 Observable 中的值，使用那些值做一些事情，并且把它们传出来
        //透過 log方法 寫入到訊息組件
        catchError(this.handleError<Hero[]>('getHeroes', [])) //RxJS 的 catchError() 異常處理
        //操作符会拦截失败的 Observable。 它把错误对象传给错误处理器，错误处理器会处理这个错误。
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
    const url = `${this.heroesUrl}/${id}`; // 如同:api/heroes/11
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* 搜索英雄
  */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);//若未輸入則傳回個空物件[陣列]
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`有符合關鍵字英雄資料 "${term}"`) : //符合關鍵字
         this.log(`沒有吻合的關鍵字 "${term}"`)), //沒有找到資料
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** 新增資料到 緩存資料庫中
   * post 增加傳入 url / hero 要寫入的物件 / 請求頭(HttpHeaders)-宣告傳去的格式
  */
  addHero (hero: Hero): Observable<Hero> {

    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      //tap((newHero: Hero) 生成個id..如何生成暫不清楚?
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)), 
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** 從緩存資料庫中刪除資料
  */
  deleteHero (hero: Hero | number): Observable<Hero> {
    //三元运算符。一般来说，三目运算符的结合性是右结合的-
    //条件 ? 结果1 : 结果2 里面的？号是格式要求。也zd可以理解为条件是否成立，条件成立为结果1，否则为结果2
    //如:z=x>y? x : y => 如果x>y，就把z=x，否则z=y
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** 更新資料到 緩存資料庫中
   * HttpClient.put() 方法接受三个参数：URL 地址/要修改的数据（这里就是修改后的英雄）/选项
   * put()-来把修改后的英雄保存到服务器上
  */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * 在控制台(console)报告这个错误，并返回一个无害的结果（安全值），以便应用能正常工作
   *  handleError() 方法会报告这个错误，并返回一个无害的结果（安全值），以便应用能正常工作
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
