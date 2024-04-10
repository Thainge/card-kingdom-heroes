import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattleComponent } from './pages/battle/battle.component';
import { MapComponent } from './pages/map/map.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  // { path: 'battle', component: BattleComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
