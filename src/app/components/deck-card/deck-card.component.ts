import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DeckCardComponent {
  constructor() {}

  ngOnInit(): void {}
}
