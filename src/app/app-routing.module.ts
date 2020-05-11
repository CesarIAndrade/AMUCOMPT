import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './nav/nav.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PersonaComponent } from './components/persona/persona.component';
import { InventarioComponent } from "./components/inventario/inventario.component";
import { CompraComponent } from "./components/compra/compra.component";
import { VentaComponent } from "./components/venta/venta.component";
import { Page404Component } from './components/page404/page404.component';

// Guards
import { ValidarUsuarioGuard } from "src/app/guards/validar-usuario.guard";
import { PanelAdministracionComponent } from './components/panel-administracion/panel-administracion.component';
import { ConfiguracionProductoComponent } from './components/configuracion-producto/configuracion-producto.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { StockComponent } from './components/stock/stock.component';
import { CompraRubrosComponent } from './components/compra-rubros/compra-rubros.component';
import { VentaRubrosComponent } from './components/venta-rubros/venta-rubros.component';
import { CreditosAbonosComponent } from './components/creditos-abonos/creditos-abonos.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavComponent,
    // canActivate: [ValidarUsuarioGuard],
    children: [
      {
        path: 'usuarios', component: UsuarioComponent,
        // canActivate: [ValidarUsuarioGuard] 
      },
      {
        path: 'personas', component: PersonaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'configuracion-productos', component: ConfiguracionProductoComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'inventarios', component: InventarioComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'stock', component: StockComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'abonos', component: CreditosAbonosComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'compras', component: CompraComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'compras-rubros', component: CompraRubrosComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'ventas', component: VentaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'ventas-rubros', component: VentaRubrosComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'localizaciones', component: PanelAdministracionComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: 'cuenta', component: CuentaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
    ]
  },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
