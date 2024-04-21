import { Injectable, inject } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { AuthService } from './auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  private firestore = inject(Firestore);
  private authSvc = inject(AuthService);
  private store = inject(Store<AppState>);

  initIngresoEgresoListener(uid: string) {
    return onSnapshot(collection(this.firestore, uid, 'ingreso-egreso', 'items'), ingresosEgresosSnap => {
      const ingresosEgresos = ingresosEgresosSnap.docs.map(ingresoEgresoSnap => {
        const {descripcion, monto, tipo} = ingresoEgresoSnap.data();
        return new IngresoEgreso(descripcion, monto, tipo, ingresoEgresoSnap.id);
      });
      console.log({ingresosEgresos})
      this.store.dispatch(ieActions.setItems({items: ingresosEgresos}));
    })
  }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {
    const uid = this.authSvc.user.uid;

    delete ingresoEgreso.uid

    const collectionIngresoEgreso = collection(this.firestore, `${uid}/ingreso-egreso/items`);
    return setDoc(doc(collectionIngresoEgreso), {...ingresoEgreso})

  }

  borrarIngresoEgreso( uidItem: string ) {
    const uid = this.authSvc.user.uid;
    return deleteDoc(doc(this.firestore, `${uid}/ingreso-egreso/items/${uidItem}`));
  }

}
