import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-button',
  template: `<button [type]="type" [ngClass]="color">{{ label }}</button>`,
  styleUrls: ['./shared-button.component.css']
})
export class SharedButtonComponent {
  @Input() label = 'Button';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() color: 'primary' | 'secondary' = 'primary';
}
