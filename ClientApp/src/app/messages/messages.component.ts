import { Component, OnInit } from '@angular/core';
import { MessageService } from '../Service/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  
  //建構子-添加一个公有的 heroService，其类型为 HeroService
  //Angular模板(html) 只会绑定到组件的公共属性
  constructor(public messageService: MessageService) {}

  ngOnInit() {
  }

}
