import { Component, OnInit } from '@angular/core';
import { CommandServiceService } from '../command-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private commandsService: CommandServiceService) { }

  ngOnInit(): void { }

  public onNewGame(): void {
    this.commandsService.newGame();
  }

  public onCPU(): void {
    this.commandsService.requestCPUMove();
  }
}
