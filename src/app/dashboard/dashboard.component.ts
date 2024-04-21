import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Unsubscribe } from '@angular/fire/firestore';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  private store = inject(Store<AppState>);
  private ingresoEgresoSvc = inject(IngresoEgresoService);

  stop$ = new Subject();
  unsubIngresosEgresos: Unsubscribe;

  ngOnInit() {
    this.store.select('user')
    .pipe(
      takeUntil(this.stop$),
      filter( (auth:any) => auth.user !== null)
    )
    .subscribe( ({user}) => {
      console.log(user)
      this.unsubIngresosEgresos = this.ingresoEgresoSvc.initIngresoEgresoListener(user.uid);
    })
  }

  ngOnDestroy() {
    this.stop$.next(true);
    this.stop$.complete();
    this.unsubIngresosEgresos();
    this.store.dispatch(ieActions.unSetItems())
  }

}
