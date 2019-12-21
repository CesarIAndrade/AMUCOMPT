import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

// Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";

// Components
import { UsuarioComponent } from './components/usuario/usuario.component';
import { LoginComponent } from './components/login/login.component';
import { PersonaComponent } from './components/persona/persona.component';
import { Page404Component } from './components/page404/page404.component';
import { NavComponent } from "./nav/nav.component";
import { InventarioComponent } from './components/inventario/inventario.component';
import { CompraComponent } from './components/compra/compra.component';
import { VentaComponent } from './components/venta/venta.component';

// Functional Components
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ModalUsuarioComponent } from './components/modal-usuario/modal-usuario.component';
import { TabsUsuarioComponent } from './components/tabs-usuario/tabs-usuario.component';
import { PersonaLocalizacionComponent } from './components/persona-localizacion/persona-localizacion.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuarioComponent,
    LoginComponent,
    PersonaComponent,
    Page404Component,
    NavComponent,
    InventarioComponent,
    CompraComponent,
    VentaComponent,
    ModalUsuarioComponent,
    TabsUsuarioComponent,
    PersonaLocalizacionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
  ],
  entryComponents: [ 
    ModalUsuarioComponent 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
