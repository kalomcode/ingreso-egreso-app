import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {
  
  private store = inject(Store<AppStateWithIngreso>);
  private ingresoEgresoSvc = inject(IngresoEgresoService);
  ingresosSubs: Subscription;

  ingresosEgresos: IngresoEgreso[] = [];

  ngOnInit() {
    this.ingresosSubs = this.store.select('ingresosEgresos').subscribe( ({ items }) => {
      this.ingresosEgresos = items;
    })
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
  }

  borrar( uid: string ) {
    this.ingresoEgresoSvc.borrarIngresoEgreso( uid )
      .then( () => Swal.fire('Borrado','Item borrado', 'warning'))
      .catch( err => Swal.fire('Error', err.message, 'error'))
  }

}
