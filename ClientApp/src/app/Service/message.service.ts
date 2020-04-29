import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages: string[] = [];
//往缓存中添加一条消息
  add(message: string) {
    this.messages.push(message);
  }
//清空缓存
  clear() {
    this.messages = [];
  }
}
