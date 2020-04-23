import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { CommandInputComponent } from '../command-input/command-input.component';
import { CommandLogComponent } from '../command-log/command-log.component';
import { ChessBoardComponent } from '../chess-board/chess-board.component';



@NgModule({
  declarations: [HomeComponent, CommandInputComponent, CommandLogComponent, ChessBoardComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatIconModule, ReactiveFormsModule, MatListModule, MatTooltipModule, MatSlideToggleModule
  ]
})
export class HomeModule { }
