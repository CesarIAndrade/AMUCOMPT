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
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material'
// Components
import { UsuarioComponent } from './components/usuario/usuario.component';
import { LoginComponent } from './components/login/login.component';
import { PersonaComponent } from './components/persona/persona.component';
import { Page404Component } from './components/page404/page404.component';
import { NavComponent } from "./nav/nav.component";
import { InventarioComponent } from './components/inventario/inventario.component';
import { CompraComponent } from './components/compra/compra.component';
import { VentaComponent } from './components/venta/venta.component';
import { SembrioComponent } from './components/sembrio/sembrio.component';
import { CantonComponent } from './components/canton/canton.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';
import { ParroquiaComponent } from './components/parroquia/parroquia.component';
import { ProvinciaComponent } from './components/provincia/provincia.component';
import { PanelAdministracionComponent } from './components/panel-administracion/panel-administracion.component';

// Functional Components
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalDetallePersonaComponent } from './components/modal-detalle-persona/modal-detalle-persona.component';
import { ModalAsignacionUsuarioPersonaComponent } from './components/modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';
import { PipesModule } from './pipes/pipes.module';
import {MatChipsModule} from '@angular/material/chips';
import { ModalAsignacionUsuarioTiposUsuarioComponent } from './components/modal-asignacion-usuario-tipos-usuario/modal-asignacion-usuario-tipos-usuario.component';
import { MatTableModule, MatOptionModule, MatSelectModule, MatAutocompleteModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatRadioModule, MatExpansionModule, MatCardModule } from '@angular/material';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ProductoComponent } from './components/producto/producto.component';
import { TipoProductoComponent } from './components/tipo-producto/tipo-producto.component';
import { PresentacionComponent } from './components/presentacion/presentacion.component';
import { MedidaComponent } from './components/medida/medida.component';
import { ConfiguracionProductoComponent } from './components/configuracion-producto/configuracion-producto.component';
import { KitComponent } from './components/kit/kit.component';
import { ArmarKitComponent } from './components/armar-kit/armar-kit.component';
import { ModalDetalleProductoComponent } from './components/modal-detalle-producto/modal-detalle-producto.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { ModalAsignacionConfiguracionProductoComponent } from './components/modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component';
import { StockComponent } from './components/stock/stock.component';
import { CreditosAbonosComponent } from './components/creditos-abonos/creditos-abonos.component';
import { CompraRubrosComponent } from './components/compra-rubros/compra-rubros.component';
import { VentaRubrosComponent } from './components/venta-rubros/venta-rubros.component';
import { ModalLocalidadSuperiorComponent } from './components/modal-localidad-superior/modal-localidad-superior.component';
import { ModalLotesComponent } from './components/modal-lotes/modal-lotes.component';

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
    SembrioComponent,
    ProductoComponent,
    TipoProductoComponent,
    PresentacionComponent,
    MedidaComponent,
    ConfiguracionProductoComponent,
    KitComponent,
    ArmarKitComponent,
    ModalDetalleProductoComponent,
    CuentaComponent,
    ModalAsignacionConfiguracionProductoComponent,
    StockComponent,
    CreditosAbonosComponent,
    CompraRubrosComponent,
    VentaRubrosComponent,
    ModalLocalidadSuperiorComponent,
    ModalLotesComponent,
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
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PipesModule,
    MatChipsModule,
    TooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    MatGridListModule
  ],
  entryComponents: [
    ModalDetallePersonaComponent,
    ModalAsignacionUsuarioPersonaComponent ,
    ModalAsignacionUsuarioTiposUsuarioComponent,
    ModalDetalleProductoComponent,
    ModalAsignacionConfiguracionProductoComponent,
    ModalLocalidadSuperiorComponent,
    ModalLotesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
