import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommandServiceService } from '../command-service.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public showDebugView: boolean;

  @ViewChild(MatSlideToggle) debugToggle: MatSlideToggle;

  constructor(private commandsService: CommandServiceService) { 
    this.showDebugView = false;
    this.commandsService.setDebugView(this.showDebugView);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    console.log(this.debugToggle);
    this.debugToggle.change.subscribe((event: MatSlideToggleChange) => {
      this.commandsService.setDebugView(event.checked);
    });
  }

  public onNewGame(): void {
    this.commandsService.newGame();
  }

  public onCPU(): void {
    this.commandsService.requestCPUMove();
  }
}
