import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Modulos
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { appReducers } from './app.reducer';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
// import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AuthModule,

    BrowserModule,
    AppRoutingModule,

    provideFirebaseApp(() => initializeApp({"projectId":"ingreso-egreso-app-7875a","appId":"1:1068763118171:web:2c2f4224310cddf74d1d7e","storageBucket":"ingreso-egreso-app-7875a.appspot.com","apiKey":"AIzaSyAj3dTL6cGqbQETOYSiisut4QHBzeeNAzk","authDomain":"ingreso-egreso-app-7875a.firebaseapp.com","messagingSenderId":"1068763118171","measurementId":"G-2JYR9P0GV7"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    StoreModule.forRoot( appReducers ),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production
    })
  ],
  providers: [
    // provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
