import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import {Observable, } from 'rxjs';
import { CommandServiceService } from '../command-service.service';
import { CommandItem } from '../shared/models/CommandItem';

@Component({
  selector: 'app-command-log',
  templateUrl: './command-log.component.html',
  styleUrls: ['./command-log.component.scss']
})
export class CommandLogComponent implements OnInit {

  commands: Observable<CommandItem[]>;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private commandService: CommandServiceService) {
    this.commands = commandService.commands$;
   }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
    catch(err) {
      console.error(err);
    }
  }

  public onClearLog(): void {
    this.commandService.clearCommands();
  }
}
