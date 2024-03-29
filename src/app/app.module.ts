import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BattleComponent } from './pages/battle/battle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './components/dialogComponent/dialog.component';
import { MapOverlayComponent } from './components/map-overlay/map-overlay.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // BattleComponent,
    MapOverlayComponent,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
