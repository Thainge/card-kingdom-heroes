import { playerService } from 'src/app/services/player.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { gameTheme } from 'src/app/models/theme';

interface GalleryImage {
  image: string;
  theme: gameTheme;
}

@Component({
  selector: 'app-gallery-overlay',
  templateUrl: './gallery-overlay.component.html',
  styleUrls: ['./gallery-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class GalleryOverlayComponent implements OnInit {
  @Input('open') open: boolean = false;

  heroes: GalleryImage[] = [];
  bosses: GalleryImage[] = [];
  enemies: GalleryImage[] = [];
  currentImage: GalleryImage | undefined;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(private playerService: playerService) {}

  ngOnInit() {
    const hero: GalleryImage = {
      image: 'mario.png',
      theme: 'mario',
    };
    const boss: GalleryImage = {
      image: 'moblin.png',
      theme: 'default',
    };
    const enemy: GalleryImage = {
      image: 'dummy.png',
      theme: 'default',
    };
    this.currentImage = hero;
    this.heroes = [hero, hero, hero, hero, hero, hero, hero, hero];
    this.bosses = [boss, boss, boss, boss, boss, boss, boss];
    this.enemies = [
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
      enemy,
    ];
  }

  setCurrentItem(item: GalleryImage) {
    this.playerService.playSound('button.mp3');
    this.currentImage = item;
  }

  closeMenu() {
    this.playerService.playSound('close.mp3');
    this.onCloseMenu.emit(false);
  }
}
