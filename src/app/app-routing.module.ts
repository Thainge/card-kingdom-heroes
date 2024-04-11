import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattleComponent } from './pages/battle/battle.component';
import { MapComponent } from './pages/map/map.component';
import { HomeComponent } from './pages/home/home.component';
import { ZeldaMapComponent } from './pages/zeldaMap/map.component';

const routes: Routes = [
  // { path: 'battle/:world', component: BattleComponent },
  { path: 'cardkingdom-map', component: MapComponent },
  { path: 'zelda-map', component: ZeldaMapComponent },
  { path: '**', redirectTo: '/cardkingdom-map' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
