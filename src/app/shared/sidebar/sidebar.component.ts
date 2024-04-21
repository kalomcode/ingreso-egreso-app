  import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  private authSvc = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store<AppState>)
  nombre = ''

  userSub: Subscription;

  ngOnInit() {
    this.userSub = this.store.select('user').subscribe( ({user}) => {
      this.nombre = user.nombre
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  logout() {
    this.authSvc.logout().then(() => {
      this.router.navigate(['/login']);
    })
  }

  redirect(url: string) {
    this.router.navigate([url]);
  }

}
