import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
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
  dialogArray: DialogDto[] = [
    {id: 1, image: 'avatar.png', player: true, text: 'Hi my name is mario can you please go away bwoser or I will have to trail through your goombas', shownText: ''},
    {id: 2, image: 'avatar.png', player: true, text: 'Hi my name is mario can you please go away bwoser or I will have to trail through your goombas', shownText: ''},
    {id: 3, image: 'avatar.png', player: true, text: 'Hi my name is mario can you please go away bwoser or I will have to trail through your goombas', shownText: ''},
    {id: 4, image: 'avatar.png', player: true, text: 'Hi my name is mario can you please go away bwoser or I will have to trail through your goombas', shownText: ''}
  ];
  activeDialog: DialogDto = {id: 0, image: 'avatar.png', player: true, text: '', shownText: ''};

  currentlyReading: boolean = false;

  constructor(
    
  ) {}

  ngOnInit() {
    this.playNextDialog();
    // setTimeout(() => {
    //     this.playNextDialog();
    // }, 1000);
    // setTimeout(() => {
    //     this.playNextDialog();
    // }, 3000);
    // setTimeout(() => {
    //     this.playNextDialog();
    // }, 5000);
    // setTimeout(() => {
    //     this.playNextDialog();
    // }, 7000);
  }

  async playNextDialog() {
    this.dialogArray = this.dialogArray.filter((x) => x.id !== this.activeDialog.id);
    this.currentlyReading = true;
    this.activeDialog = this.dialogArray[0];
    await this.iterateLetters();
  }

  skipReadingCurrentDialog(dialog: DialogDto) {
    this.currentlyReading = false;
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async iterateLetters() {
    // Take away from total text and add to shownText
    const textArr = this.activeDialog.text.split('');
    let i = 0;
    for await (let x of textArr) {
        if (this.currentlyReading) {
            this.activeDialog.shownText = this.activeDialog.text.slice(0, i);
            i++;
            await this.timeout(20);
        } else {
            this.activeDialog.shownText = this.activeDialog.text;
        }
    }
  }
}
