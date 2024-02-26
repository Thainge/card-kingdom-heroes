import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redraw-cards-overlay',
  templateUrl: './redraw-cards-overlay.component.html',
  styleUrls: ['./redraw-cards-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class RedrawCardsOverlay {
  constructor() {}

  ngOnInit(): void {}
}
