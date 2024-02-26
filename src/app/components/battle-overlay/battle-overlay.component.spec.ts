import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleOverlayComponent } from './battle-overlay.component';

describe('BattleOverlayComponent', () => {
  let component: BattleOverlayComponent;
  let fixture: ComponentFixture<BattleOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BattleOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BattleOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
