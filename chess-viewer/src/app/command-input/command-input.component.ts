import { Component, OnInit } from '@angular/core';
import { CommandServiceService } from '../command-service.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'command-input',
  templateUrl: './command-input.component.html',
  styleUrls: ['./command-input.component.scss']
})
export class CommandInputComponent implements OnInit {

  command = new FormControl();

  constructor(private commandService: CommandServiceService) { }

  ngOnInit(): void {
  }

  onButtonClick(): void {
    let value = this.command.value + '\n';
    this.command.reset();
    this.commandService.issueCommand(value);
  }

}
