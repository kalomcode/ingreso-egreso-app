import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  private fb      = inject(FormBuilder);
  private router  = inject(Router);
  private store   = inject(Store<AppState>);
  private authSvc = inject(AuthService);

  private stop$ = new Subject();

  loginForm: FormGroup;
  cargando = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required],
    });

    this.store.select('ui').pipe(takeUntil(this.stop$)).subscribe( ui => {
      this.cargando = ui.isLoading
      console.log('cargando: ', this.cargando);
    })
  }

  ngOnDestroy() {
    this.stop$.next(true);
    this.stop$.complete();
  }

  loginUsuario() {

    if (this.loginForm.invalid) return;

    this.store.dispatch(ui.isLoading());

    // this.spinnerLoading()

    const { email, password } = this.loginForm.value;
    this.authSvc.loginUsuario(email, password)
      .then(credenciales => {
        // Swal.close();
        console.log({credenciales});
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      });

  }

  spinnerLoading() {
    Swal.fire({
      title: "Espere por favor",
      didOpen: () => Swal.showLoading()
    });
  }

}
