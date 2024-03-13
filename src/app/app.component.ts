import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

type Commands = 'help' | 'setGold';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'card-kingdom-heroes';

  consoleShouldShow: boolean = false;
  consoleHasBeenOpened: boolean = false;
  consoleOpen: boolean = false;
  consoleControl = new FormControl('');
  consoleItems: string[] = ['', "Type 'help' for a list of commands"];

  @ViewChild('consoleInput') consoleInput: ElementRef | undefined;

  constructor() {}

  ngOnInit(): void {}

  @HostListener('document:keypress', ['$event'])
  toggleConsoleKeypress(event: KeyboardEvent) {
    if (event.key && event.key.toLowerCase() === '`') {
      if (this.consoleInput) {
        this.consoleInput.nativeElement.focus();
        this.consoleControl.setValue('');
        setTimeout(() => {
          this.consoleControl.setValue('');
        }, 10);
      }
      this.consoleOpen = !this.consoleOpen;
      if (this.consoleOpen) {
        this.consoleShouldShow = this.consoleOpen;
      } else {
        setTimeout(() => {
          this.consoleShouldShow = this.consoleOpen;
        }, 500);
      }
      this.consoleHasBeenOpened = true;
    }
  }

  runCommand() {
    const newCommand = this.consoleControl.value ?? '';
    this.consoleControl.setValue('');

    this.determineCommand(newCommand);
  }

  async determineCommand(value: string) {
    if (value === 'help') {
      await this.timeout(500);
      this.consoleItems.unshift('--- Commands List ---');
      this.consoleItems.unshift(
        'Gives player x amount of gold: &nbsp;&nbsp;&nbsp;&nbsp;<b>setGold x</b>'
      );
      this.consoleItems.unshift(
        'Shows list of possible commands: &nbsp; <b>help</b>'
      );
      this.consoleItems.unshift(
        'Clears the console: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b>clear</b>'
      );
      this.consoleItems.unshift('');
      return;
    }

    if (value.includes('setGold')) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      return;
    }

    if (value.includes('clear')) {
      this.consoleItems = ['', "Type 'help' for a list of commands"];
      return;
    }

    this.consoleItems.unshift('');
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  closeConsole() {
    this.consoleHasBeenOpened = true;
    setTimeout(() => {
      this.consoleShouldShow = this.consoleOpen;
    }, 500);
    this.consoleOpen = false;
  }
}
