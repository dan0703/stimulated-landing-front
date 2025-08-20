import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-card',
  template: `
    <div class="shared-card">
      <h3>{{ title }}</h3>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./shared-card.component.css']
})
export class SharedCardComponent {
  @Input() title = '';
}
