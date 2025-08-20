import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCardComponent } from './shared-card.component';
import { SharedButtonComponent } from './shared-button.component';

@NgModule({
  declarations: [SharedCardComponent, SharedButtonComponent],
  imports: [CommonModule],
  exports: [SharedCardComponent, SharedButtonComponent]
})
export class SharedModule {}
