import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Screen2Component } from './screen2.component';
import { Screen2ChildComponent } from './components/screen2-child.component';
import { Screen2ExclusiveComponent } from './components/screen2-exclusive.component';
import { Screen2RoutingModule } from './screen2-routing.module';
import { SharedModule } from '../../shared/components/shared.module';

@NgModule({
  declarations: [Screen2Component, Screen2ChildComponent, Screen2ExclusiveComponent],
  imports: [CommonModule, Screen2RoutingModule, SharedModule],
  exports: [Screen2Component]
})
export class Screen2Module {}
