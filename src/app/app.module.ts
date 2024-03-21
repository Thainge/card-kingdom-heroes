import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BattleComponent } from './pages/battle/battle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './components/dialogComponent/dialog.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // BattleComponent,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
