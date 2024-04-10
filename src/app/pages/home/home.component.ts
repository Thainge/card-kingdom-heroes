import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  zoomInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { CampaignOverlayComponent } from 'src/app/components/campaign-overlay/campaign-overlay.component';
import { DifficultyOverlayComponent } from 'src/app/components/choose-difficulty-overlay/choose-difficulty-overlay.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, DifficultyOverlayComponent, CampaignOverlayComponent],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class HomeComponent implements OnInit {
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {}
}
