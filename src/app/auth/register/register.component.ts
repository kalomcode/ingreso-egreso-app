import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  private authSvc = inject(AuthService);
  private fb      = inject(FormBuilder);
  private store   = inject(Store<AppState>);
  private router  = inject(Router);

  private stop$ = new Subject();

  registroForm: FormGroup;
  cargando = false;

  ngOnInit() {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],      
      correo: ['', [Validators.required, Validators.email]],      
      password: ['', Validators.required],      
    });

    this.store.select('ui').pipe(takeUntil(this.stop$)).subscribe( ui => {
      this.cargando = ui.isLoading
    })

  }

  ngOnDestroy() {
    this.stop$.next(true);
    this.stop$.complete();
  }

  crearUsuario() {

    if ( this.registroForm.invalid) return;

    this.store.dispatch(ui.isLoading());

    // this.spinnerLoading()

    const { nombre, correo, password } = this.registroForm.value;
    this.authSvc.crearUsuario( nombre, correo, password )
      .then( credenciales => {
        // Swal.close();
        console.log({credenciales})
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/'])
      })
      .catch( err => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      })

  }

  spinnerLoading() {
    Swal.fire({
      title: "Espere por favor",
      didOpen: () => Swal.showLoading()
    });
  }

}
