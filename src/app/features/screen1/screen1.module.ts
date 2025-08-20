import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Screen1Component } from './screen1.component';
import { Screen1ChildComponent } from './components/screen1-child.component';
import { Screen1ExclusiveComponent } from './components/screen1-exclusive.component';
import { Screen1RoutingModule } from './screen1-routing.module';
import { SharedModule } from '../../shared/components/shared.module';

@NgModule({
  declarations: [Screen1Component, Screen1ChildComponent, Screen1ExclusiveComponent],
  imports: [CommonModule, Screen1RoutingModule, SharedModule],
  exports: [Screen1Component]
})
export class Screen1Module {}
