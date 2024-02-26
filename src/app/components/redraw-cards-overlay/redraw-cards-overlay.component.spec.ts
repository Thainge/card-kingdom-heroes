import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedrawCardsOverlay } from './redraw-cards-overlay.component';

describe('RedrawCardsOverlay', () => {
  let component: RedrawCardsOverlay;
  let fixture: ComponentFixture<RedrawCardsOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedrawCardsOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(RedrawCardsOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
