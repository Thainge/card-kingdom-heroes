import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-battle-overlay',
  templateUrl: './battle-overlay.component.html',
  styleUrls: ['./battle-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class BattleOverlayComponent {
  constructor() {}

  ngOnInit(): void {}
}
