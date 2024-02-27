import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerDto } from 'src/app/models/player';
import {
  fadeInOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),
  ],
})
export class CharacterCardComponent {
  @Input('player') item!: PlayerDto;
  @Input('activeTarget') activeTarget: boolean = false;
  @Input('display') display: boolean = false;

  @Output('onCLicked') onClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onPlayerClicked() {
    this.onClicked.emit(this.item);
  }
}
