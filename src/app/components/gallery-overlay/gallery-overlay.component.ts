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
      image: 'bokoblin.png',
      theme: 'default',
    };
    const enemy: GalleryImage = {
      image: 'dummy.png',
      theme: 'default',
    };
    this.currentImage = hero;
    this.heroes = [
      { image: 'eridan.png', theme: 'default' },
      { image: 'nivus.png', theme: 'default' },
      { image: 'mirage.png', theme: 'default' },
      { image: 'link.png', theme: 'zelda' },
      { image: 'mario.png', theme: 'mario' },
    ];
    this.bosses = [
      { image: '10.png', theme: 'default' },
      { image: '18.png', theme: 'default' },
      { image: '19.png', theme: 'default' },
      { image: '20.png', theme: 'default' },
      { image: '30.png', theme: 'default' },
      { image: '39.png', theme: 'default' },
      { image: '40.png', theme: 'default' },

      { image: 'zelda9.png', theme: 'zelda' },
      { image: 'zelda11.png', theme: 'zelda' },
      { image: 'zelda13.png', theme: 'zelda' },
      { image: 'zelda12.png', theme: 'zelda' },
    ];
    this.enemies = [
      { image: '1.png', theme: 'default' },
      { image: '2.png', theme: 'default' },
      { image: '3.png', theme: 'default' },
      { image: '4.png', theme: 'default' },
      { image: '5.png', theme: 'default' },
      { image: '6.png', theme: 'default' },
      { image: '7.png', theme: 'default' },
      { image: '8.png', theme: 'default' },
      { image: '9.png', theme: 'default' },
      { image: '11.png', theme: 'default' },
      { image: '12.png', theme: 'default' },
      { image: '13.png', theme: 'default' },
      { image: '14.png', theme: 'default' },
      { image: '15.png', theme: 'default' },
      { image: '16.png', theme: 'default' },
      { image: '17.png', theme: 'default' },
      { image: '21.png', theme: 'default' },
      { image: '22.png', theme: 'default' },
      { image: '23.png', theme: 'default' },
      { image: '24.png', theme: 'default' },
      { image: '25.png', theme: 'default' },
      { image: '26.png', theme: 'default' },
      { image: '27.png', theme: 'default' },
      { image: '28.png', theme: 'default' },
      { image: '29.png', theme: 'default' },
      { image: '31.png', theme: 'default' },
      { image: '32.png', theme: 'default' },
      { image: '33.png', theme: 'default' },
      { image: '34.png', theme: 'default' },
      { image: '35.png', theme: 'default' },
      { image: '36.png', theme: 'default' },
      { image: '37.png', theme: 'default' },
      { image: '38.png', theme: 'default' },

      { image: 'zelda1.png', theme: 'zelda' },
      { image: 'zelda2.png', theme: 'zelda' },
      { image: 'zelda3.png', theme: 'zelda' },
      { image: 'zelda4.png', theme: 'zelda' },
      { image: 'zelda5.png', theme: 'zelda' },
      { image: 'zelda6.png', theme: 'zelda' },
      { image: 'zelda7.png', theme: 'zelda' },
      { image: 'zelda8.png', theme: 'zelda' },
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
