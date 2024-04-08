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

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: any) => item.id;
}
