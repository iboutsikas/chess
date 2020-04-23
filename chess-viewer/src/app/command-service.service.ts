import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { CommandReply } from './shared/models/CommandReply';
import { ChessBlock } from './shared/models/ChessBlock';
import { CommandItem } from './shared/models/CommandItem';
import { HttpClient } from '@angular/common/http';

const NEWGAME_WHITE = "00 W\n";
const NEWGAME_BLACK = "00 B\n";
const REQUEST_CPU = "03\n";
const REQUEST_STATE = "01\n";

@Injectable({
  providedIn: 'root'
})
export class CommandServiceService {
  private connectionString: string;
  private issuedCommands: CommandItem[] = [];
  private lastState: ChessBlock[];
  private showDebugView: boolean;

  private sentCommands: Subject<CommandItem[]>;
  private state: Subject<ChessBlock[]>;

  get commands$(): Observable<CommandItem[]> {
    return this.sentCommands;
  }

  get blocks(): Observable<ChessBlock[]> {
    return this.state;
  }

  constructor(private http: HttpClient) {
    this.sentCommands = new Subject<CommandItem[]>();
    this.state = new Subject<ChessBlock[]>();
    this.lastState = [];
    this.connectionString = 'http://localhost:3000';
  }

  public issueCommand(command: string) {
    if (!command) return;
    let body = {
      command: command
    }

    this.http.post<CommandReply>(this.connectionString, body)
      .subscribe(data => {
        this.issuedCommands.push({command: data.command, reply: data.reply});
        this.lastState = data.state;

        this.sentCommands.next(this.issuedCommands);
        const rev = this.mapState(this.lastState);
        
        this.state.next(rev);
      });
  }

  public localCommand(tokens: string[]): void {
    let item: CommandItem = {
      command: tokens.join(' '),
      reply: ''
    };

    if (tokens[0] == 'connection') {
      this.connectionString = tokens[1];
      item.reply = 'Connection string changed';
    }
    else {
      item.reply = 'Unknown Command';
    }

    this.issuedCommands.push(item);

    this.sentCommands.next(this.issuedCommands);
  }

  public clearCommands(): void {
    this.issuedCommands = [];
    this.sentCommands.next(this.issuedCommands);
  }

  public requestCPUMove(): void {
    this.issueCommand(REQUEST_CPU);
  }

  public newGame(): void {
    let command = (Math.random() < 0.5) ? NEWGAME_WHITE : NEWGAME_BLACK;

    this.issueCommand(command);
  }

  public setDebugView(enable: boolean): void {
    this.showDebugView = enable;

    this.state.next(this.mapState(this.lastState));
  }

  private mapState(state:ChessBlock[]): ChessBlock[] {
    if (state.length == 0) {
      return state;
    }

    let rv = [];
    if (this.showDebugView) {
      rv = state;
    }
    else {
      rv = [...state];

      for(let y = 0; y < 4; y++) {
        for (let x = 0; x < 8; x++) {
          let temp = rv[y * 8 + x];
          rv[y * 8 + x] = rv[(7 - y) * 8 + x];
          rv[(7 - y) * 8 + x] = temp;
        }
      }
    }
    return rv;
  }

}
