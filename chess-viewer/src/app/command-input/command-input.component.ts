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
    let value = this.command.value;
    this.command.reset();

    if (value[0] == '/') {
      this.processLocalCommand(value);
      return;
    }

    value = value + '\n';

    this.commandService.issueCommand(value);
  }

  private processLocalCommand(command: string): void {
    let tokens = command.split(' ');
    tokens[0] = tokens[0].slice(1);

    this.commandService.localCommand(tokens);
      
  }
}
