import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  flipInYOnEnterAnimation,
  fadeOutDownOnLeaveAnimation,
  fadeInDownOnEnterAnimation,
  fadeInLeftOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
  fadeOutRightOnLeaveAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { DialogDto } from 'src/app/models/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),
    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),

    fadeOutLeftOnLeaveAnimation({ anchor: 'fadeLeftLeave' }),
    fadeInLeftOnEnterAnimation({ anchor: 'fadeLeftEnter' }),

    fadeOutRightOnLeaveAnimation({ anchor: 'fadeRightLeave' }),
    fadeInRightOnEnterAnimation({ anchor: 'fadeRightEnter' }),

    fadeInDownOnEnterAnimation({ anchor: 'fadeDownEnter' }),
    fadeOutDownOnLeaveAnimation({ anchor: 'fadeDownLeave' }),

    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
    flipInYOnEnterAnimation({ anchor: 'flipInYonEnter' }),
  ],
})
export class DialogComponent implements OnInit {
  dialogArrayStatic: DialogDto[] = [];
  activeDialog: DialogDto = {
    id: 0,
    image: 'avatar.png',
    player: true,
    text: '',
    shownText: '',
    left: true,
  };

  currentlyReading: boolean = false;
  isIterating: boolean = false;

  @Input('dialogArray') set dialogArray(dialogArray: DialogDto[]) {
    if (dialogArray.length > 0) {
      this.dialogArrayStatic = dialogArray;
      this.currentlyReading = true;
      this.activeDialog = this.dialogArrayStatic[0];
      this.iterateLetters();
    }
  }
  @Output() finishedDialog = new EventEmitter<boolean>(true);

  constructor() {}

  ngOnInit() {}

  async playNextDialog() {
    if (this.dialogArrayStatic.length > 0) {
      this.dialogArrayStatic = this.dialogArrayStatic.filter(
        (x) => x.id !== this.activeDialog.id
      );
      this.currentlyReading = true;
      this.activeDialog = this.dialogArrayStatic[0];

      await this.iterateLetters();
    }
  }

  skipReadingCurrentDialog() {
    if (this.isIterating) {
      this.currentlyReading = false;
    }

    if (!this.isIterating) {
      this.playNextDialog();
    }
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async iterateLetters() {
    console.log(this.dialogArrayStatic);

    // Take away from total text and add to shownText
    if (
      this.activeDialog &&
      this.activeDialog.text &&
      this.activeDialog.text.length > 0
    ) {
      const textArr = this.activeDialog.text.split('');
      let i = 0;

      this.isIterating = true;
      // Iterate over letters
      for await (let x of textArr) {
        if (this.currentlyReading) {
          this.activeDialog.shownText = this.activeDialog.text.slice(0, i);
          i++;
          await this.timeout(20);
        } else {
          // If clicked iterate faster
          i++;
          await this.timeout(0.5);
          this.activeDialog.shownText = this.activeDialog.text.slice(0, i);
        }
      }
      this.isIterating = false;
    } else {
      this.finishedDialog.emit(true);
    }
  }
}
