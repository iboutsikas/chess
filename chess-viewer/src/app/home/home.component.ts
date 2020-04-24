import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommandServiceService } from '../command-service.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { ElectronService } from '../core/services';

import {compare} from 'compare-versions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public showDebugView: boolean;

  @ViewChild(MatSlideToggle) debugToggle: MatSlideToggle;

  constructor(private commandsService: CommandServiceService,
              private electronService: ElectronService, 
              private snackBar: MatSnackBar,
              private http: HttpClient) 
  { 
    this.showDebugView = false;
    this.commandsService.setDebugView(this.showDebugView);
  }

  ngOnInit(): void { 
    this.checkVersion();
  }

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

  private checkVersion(): void {
    this.http.get<any>('https://bluegrit.cs.umbc.edu/~iboutsi1/versioncheck.json')
    .pipe(
      map(json => json.viewer.version)
    )
    .subscribe((version: string) => {
      const my_version = this.electronService.electronVersion;
      let snackBarRef;
      const thereIsANewVersion = compare(version, my_version, '>');
      
      if (thereIsANewVersion) {
        snackBarRef = this.snackBar.open('There is a newer version available', 'Open', { duration: 15000 });
      }
      else {
        snackBarRef = this.snackBar.open('You are on the latest version!', 'Close', { duration: 10000 });
      }

      snackBarRef.onAction().subscribe(() => {
        if (thereIsANewVersion)
          this.electronService.remote.shell.openExternal('https://bluegrit.cs.umbc.edu/~iboutsi1');
      });

    });
  }
}
