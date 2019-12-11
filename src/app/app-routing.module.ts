import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { PersonaComponent } from './components/persona/persona.component';


const routes: Routes = [
  // { path: 'usuarios', component: UsuarioComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'inicio', 
    children: [
      { path: 'usuarios', component: UsuarioComponent },
      { path: 'personas', component: PersonaComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
