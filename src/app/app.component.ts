import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  private authSvc = inject(AuthService);
  
  ngOnInit() {
  
    this.authSvc.initAuthListener();

  }
  
}

