import { Component, OnInit } from '@angular/core';
import { ChessBlock } from '../shared/models/ChessBlock'
import { CommandServiceService } from '../command-service.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {

  blocks: Observable<ChessBlock[]>;

  constructor(private commandService: CommandServiceService) {
    this.blocks = commandService.blocks;
  }

  ngOnInit(): void {
    // this.blocks = Array(8 * 8).fill(null).map((x, i) => i);
  }

}
