import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as uiActions from '../shared/ui.actions';
import { Subject, takeUntil } from 'rxjs';
import { isLoading } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  
  private fb = inject(FormBuilder);
  private ingresoEgresoSvc = inject(IngresoEgresoService);
  private store = inject(Store<AppState>);
  
  stop$ = new Subject();
  
  ingresoForm: FormGroup;
  tipo = 'ingreso';
  cargando = false;
  
  ngOnInit() {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
    
    this.store.select('ui').pipe(takeUntil(this.stop$)).subscribe(({isLoading}) => {
      this.cargando = isLoading;
    })
    
  }

  ngOnDestroy() {
    this.stop$.next(true);
    this.stop$.complete();
  }

  guardar() {

    if (this.ingresoForm.invalid) return;

    this.store.dispatch(uiActions.isLoading());

    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoSvc.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoForm.reset();
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success')
      })
      .catch( err => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire('Error', err.message, 'error');
      });
  }

}
