import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "./pipes/pipes.module";
import { MatChipsModule } from "@angular/material/chips";
import { TooltipModule } from "ng2-tooltip-directive";

// Components
import { UsuarioComponent } from "./components/usuario/usuario.component";
import { LoginComponent } from "./components/login/login.component";
import { PersonaComponent } from "./components/persona/persona.component";
import { Page404Component } from "./components/page404/page404.component";
import { NavComponent } from "./nav/nav.component";
import { InventarioComponent } from "./components/inventario/inventario.component";
import { CompraComponent } from "./components/compra/compra.component";
import { VentaComponent } from "./components/venta/venta.component";
import { CantonComponent } from "./components/canton/canton.component";
import { ComunidadComponent } from "./components/comunidad/comunidad.component";
import { ParroquiaComponent } from "./components/parroquia/parroquia.component";
import { ProvinciaComponent } from "./components/provincia/provincia.component";
import { PanelAdministracionComponent } from "./components/panel-administracion/panel-administracion.component";
import { ModalDetallePersonaComponent } from "./components/modal-detalle-persona/modal-detalle-persona.component";
import { ModalAsignacionUsuarioPersonaComponent } from "./components/modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component";
import { ModalAsignacionUsuarioTiposUsuarioComponent } from "./components/modal-asignacion-usuario-tipos-usuario/modal-asignacion-usuario-tipos-usuario.component";
import { ProductoComponent } from "./components/producto/producto.component";
import { ConfiguracionProductoComponent } from "./components/configuracion-producto/configuracion-producto.component";
import { ArmarKitComponent } from "./components/armar-kit/armar-kit.component";
import { CuentaComponent } from "./components/cuenta/cuenta.component";
import { ModalAsignacionConfiguracionProductoComponent } from "./components/modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component";
import { StockComponent } from "./components/stock/stock.component";
import { CreditosAbonosComponent } from "./components/creditos-abonos/creditos-abonos.component";
import { CompraRubrosComponent } from "./components/compra-rubros/compra-rubros.component";
import { ModalLocalidadSuperiorComponent } from "./components/modal-localidad-superior/modal-localidad-superior.component";
import { ModalLotesComponent } from "./components/modal-lotes/modal-lotes.component";
import { MaterialModule } from './material.module';
import { AsignarTecnicoClienteComponent } from './components/asignar-tecnico-cliente/asignar-tecnico-cliente.component';
import { VisitaComponent } from './components/visita/visita.component';
import { ComunidadesBottomSheet } from './components/visita/comunidades-bottom-sheet.component';
import { RegistrarVisitaComponent } from './components/registrar-visita/registrar-visita.component';
import { DialogAlertComponent } from './components/dialog-alert/dialog-alert.component';
import { ModalPersonaComponent } from './components/modal-persona/modal-persona.component';
import { ModalReasignarClientesComponent } from './components/modal-reasignar-clientes/modal-reasignar-clientes.component';
import { TablaPersonaComponent } from './components/tabla-persona/tabla-persona.component';
import { CompraVentaComponent } from './components/compra-venta/compra-venta.component';
import { VisitasFinalizadasComponent } from './components/visitas-finalizadas/visitas-finalizadas.component';
import { RealizarAbonoComponent } from './components/realizar-abono/realizar-abono.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CompraRubrosEntradaComponent } from './components/compra-rubros-entrada/compra-rubros-entrada.component';
import { CompraRubrosSalidaComponent } from './components/compra-rubros-salida/compra-rubros-salida.component';
import { ModalTicketFinalizadoComponent } from './components/modal-ticket-finalizado/modal-ticket-finalizado.component';
import { ComprasRubrosAnuladasComponent } from './components/compras-rubros-anuladas/compras-rubros-anuladas.component';
import { VentaRubrosEntradaComponent } from './components/venta-rubros-entrada/venta-rubros-entrada.component';
import { VentaRubrosSalidaComponent } from './components/venta-rubros-salida/venta-rubros-salida.component';
import { VentaRubrosComponent } from './components/venta-rubros/venta-rubros.component';
import { ModalModificarDatosTicketVentaComponent } from './components/modal-modificar-datos-ticket-venta/modal-modificar-datos-ticket-venta.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ModalConfigurarReporteComponent } from './components/modal-configurar-reporte/modal-configurar-reporte.component';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';

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
    ProductoComponent,
    ConfiguracionProductoComponent,
    ArmarKitComponent,
    CuentaComponent,
    ModalAsignacionConfiguracionProductoComponent,
    StockComponent,
    CreditosAbonosComponent,
    CompraRubrosComponent,
    ModalLocalidadSuperiorComponent,
    ModalLotesComponent,
    AsignarTecnicoClienteComponent,
    VisitaComponent,
    ComunidadesBottomSheet,
    RegistrarVisitaComponent,
    DialogAlertComponent,
    ModalPersonaComponent,
    ModalReasignarClientesComponent,
    TablaPersonaComponent,
    CompraVentaComponent,
    VisitasFinalizadasComponent,
    RealizarAbonoComponent,
    ConfirmDialogComponent,
    CompraRubrosEntradaComponent,
    CompraRubrosSalidaComponent,
    ModalTicketFinalizadoComponent,
    ComprasRubrosAnuladasComponent,
    VentaRubrosEntradaComponent,
    VentaRubrosSalidaComponent,
    VentaRubrosComponent,
    ModalModificarDatosTicketVentaComponent,
    ReportesComponent,
    ModalConfigurarReporteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MatChipsModule,
    TooltipModule,
    MaterialModule
  ],
  entryComponents: [
    ModalDetallePersonaComponent,
    ModalAsignacionUsuarioPersonaComponent,
    ModalAsignacionUsuarioTiposUsuarioComponent,
    ModalAsignacionConfiguracionProductoComponent,
    ModalLocalidadSuperiorComponent,
    ModalLotesComponent,
    ComunidadesBottomSheet,
    DialogAlertComponent,
    ModalPersonaComponent,
    ModalReasignarClientesComponent,
    RealizarAbonoComponent,
    ConfirmDialogComponent,
    ModalTicketFinalizadoComponent,
    ModalModificarDatosTicketVentaComponent,
    ModalConfigurarReporteComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
