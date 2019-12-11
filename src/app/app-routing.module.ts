import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { PersonaComponent } from './components/persona/persona.component';

import { NoMenuGuard } from "./guards/no-menu.guard";
import { MenuGuard } from "./guards/menu.guard";


const routes: Routes = [
  // { path: 'usuarios', component: UsuarioComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'inicio', 
    component: NavComponent,
    children: [
      { path: 'personas', component: PersonaComponent },
      { path: 'usuarios', component: UsuarioComponent  },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
