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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalDetallePersonaComponent } from './components/modal-detalle-persona/modal-detalle-persona.component';
import { ModalAsignacionUsuarioPersonaComponent } from './components/modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';
import { PipesModule } from './pipes/pipes.module';
import {MatChipsModule} from '@angular/material/chips';
import { PanelAdministracionComponent } from './components/panel-administracion/panel-administracion.component';
import { CantonComponent } from './components/canton/canton.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';
import { ParroquiaComponent } from './components/parroquia/parroquia.component';
import { ProvinciaComponent } from './components/provincia/provincia.component';
import { ModalAsignacionUsuarioTiposUsuarioComponent } from './components/modal-asignacion-usuario-tipos-usuario/modal-asignacion-usuario-tipos-usuario.component';
import { ModalDetalleUsuarioComponent } from './components/modal-detalle-usuario/modal-detalle-usuario.component';

import { TooltipModule } from 'ng2-tooltip-directive';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material';

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
    ModalDetallePersonaComponent,
    ModalAsignacionUsuarioPersonaComponent,
    PanelAdministracionComponent,
    CantonComponent,
    ComunidadComponent,
    ParroquiaComponent,
    ProvinciaComponent,
    ModalAsignacionUsuarioTiposUsuarioComponent,
    ModalDetalleUsuarioComponent
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
    MatTableModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    PipesModule,
    MatChipsModule,
    TooltipModule,
  ],
  entryComponents: [ 
    ModalDetallePersonaComponent,
    ModalAsignacionUsuarioPersonaComponent ,
    ModalAsignacionUsuarioTiposUsuarioComponent,
    ModalDetalleUsuarioComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
