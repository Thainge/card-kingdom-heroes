import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CheatCommands } from '../models/cheatCommands';

@Injectable({
  providedIn: 'root',
})
export class CheatsService {
  readonly cheats$ = new BehaviorSubject<CheatCommands>('');

  constructor() {}
}
