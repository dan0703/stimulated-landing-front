import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.css']
})
export class Screen1Component {
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get<any>('test-endpoint').subscribe(result => {
      this.data = result;
    });
  }
}
