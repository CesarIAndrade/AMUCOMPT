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


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'inicio', 
    component: NavComponent,
    children: [
      { path: 'usuarios', component: UsuarioComponent  },
      { path: 'personas', component: PersonaComponent },
      { path: 'inventarios', component: InventarioComponent },
      { path: 'compras', component: CompraComponent },
      { path: 'ventas', component: VentaComponent },
    ]
  },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
