import { Component } from '@angular/core';
import { DashboardComponent } from './component/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [DashboardComponent],
  template: `<app-dashboard></app-dashboard>`,
})
export class App {
  protected title = 'Yosef Nago';
}
