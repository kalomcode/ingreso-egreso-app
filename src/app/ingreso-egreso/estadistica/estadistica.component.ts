import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso';
import { ChartConfiguration } from 'chart.js';
import { Subscription, filter, tap } from 'rxjs';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  private store = inject(Store<AppStateWithIngreso>);
  ieSub: Subscription

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos' ];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [ 350, 450, 100 ], label: 'Series A' },
    { data: [ 50, 150, 120 ], label: 'Series B' },
    { data: [ 250, 130, 70 ], label: 'Series C' }
  ];
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true
  };

  ingresos = 0;
  egresos = 0;
  totalIngresos = 0;
  totalEgresos = 0;

  ngOnInit() {
    this.ieSub = this.store.select('ingresosEgresos')
      .pipe(
        tap(auth => console.log({auth})),
        filter( (auth:any) => auth.user !== null)
      )
      .subscribe( ({items}) => this.generarEstadistica(items));
  }

  ngOnDestroy() {
    this.ieSub.unsubscribe();
  }

  generarEstadistica( items: IngresoEgreso[] ) {

    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso'){
        this.totalIngresos += item.monto;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    }

    this.doughnutChartDatasets = [{
      data:[this.totalIngresos, this.totalEgresos]
    }]
   
    
  }

}
