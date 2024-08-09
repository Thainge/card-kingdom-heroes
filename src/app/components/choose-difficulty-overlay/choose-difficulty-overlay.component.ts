import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
} from 'angular-animations';
import { LocalStorageVersion } from 'src/app/services/env';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { playerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-choose-difficulty-overlay',
  templateUrl: './choose-difficulty-overlay.component.html',
  styleUrls: ['./choose-difficulty-overlay.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),
  ],
})
export class DifficultyOverlayComponent implements OnInit {
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
  }
  @Input('showInformation') showInformation: boolean = true;
  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(
    private loadingService: LoadingService,
    private playerService: playerService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  chooseEasy() {
    this.playerService.playSound('button.mp3');
    this.loadingService.difficultyIsOpen$.next(false);
    localStorage.setItem(
      LocalStorageVersion + 'easymode',
      JSON.stringify(true)
    );
    this.closeMenu();
  }

  chooseHard() {
    this.playerService.playSound('button.mp3');
    this.loadingService.difficultyIsOpen$.next(false);
    localStorage.setItem(
      LocalStorageVersion + 'easymode',
      JSON.stringify(false)
    );
    this.closeMenu();
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: any) => item.id;
}
