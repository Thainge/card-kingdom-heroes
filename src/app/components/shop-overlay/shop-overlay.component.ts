import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
  fadeInLeftOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
  fadeOutRightOnLeaveAnimation,
} from 'angular-animations';
import Glide from '@glidejs/glide';

type ShopStep = 'picking' | 'shopping' | 'opening';

@Component({
  selector: 'app-shop-overlay-overlay',
  templateUrl: './shop-overlay.component.html',
  styleUrls: ['./shop-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),

    fadeOutLeftOnLeaveAnimation({ anchor: 'fadeLeftLeave' }),
    fadeInLeftOnEnterAnimation({ anchor: 'fadeLeftEnter' }),

    fadeOutRightOnLeaveAnimation({ anchor: 'fadeRightLeave' }),
    fadeInRightOnEnterAnimation({ anchor: 'fadeRightEnter' }),
  ],
})
export class ShopOverlayComponent implements OnInit {
  open: boolean = false;

  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    if (x) {
      new Glide('.glide').mount();
      this.cdRef.detectChanges();
    }
  }
  currentStep: ShopStep = 'shopping';

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}
