import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { UsuarioComponent } from './components/usuario/usuario.component';
import { LoginComponent } from './components/login/login.component';
import { PersonaComponent } from './components/persona/persona.component';

import { Page404Component } from './components/page404/page404.component';
import { InicioComponent } from "./components/inicio/inicio.component";
import { NavComponent } from './nav/nav.component';

const routes: Routes = [
  // // { path: 'usuarios', component: UsuarioComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'i', 
    component: NavComponent,
    children: [
      { path: 'personas', component: PersonaComponent },
      { path: 'usuarios', component: UsuarioComponent  },
      { path: 'inicio', component: InicioComponent }
    ]
  },
  
  
  { path: 'login', component: LoginComponent },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
