import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  authState, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.models';
import { Firestore, Unsubscribe, collection, doc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private store = inject(Store<AppState>);

  authState$ = authState(this.auth);
  unsubFUser: Unsubscribe;

  private _user: Usuario;

  get user() {
    return { ...this._user };
  }

  initAuthListener() {
    this.authState$.subscribe( fuser => {
      if (fuser) {
        this.unsubFUser = onSnapshot(doc(this.firestore, fuser.uid, 'user'), userSnap => {
          const userData = userSnap.data() as Usuario;
          this._user = Usuario.fromFirebase(userData);
          this.store.dispatch(authActions.setUser({user: this._user}))
        })
      } else {
        this.unsubFUser();
        this._user = null;
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ieActions.unSetItems());
      }
    });
  }

  async crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(({user}) => {
      const newUser = new Usuario(user.uid, nombre, user.email);
      const collectionRef = collection(this.firestore, `${user.uid}`);
      const documentRef = doc(collectionRef, 'user');
      setDoc(documentRef, {...newUser});
 
    })
  }

  loginUsuario( email: string, password: string ) {
    return signInWithEmailAndPassword(this.auth, email, password );
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.authState$.pipe(
      map( fbUser => fbUser != null)
    );
  }

}
