import { Component, OnInit, Inject } from '@angular/core';

// Components
import { TabsUsuarioComponent } from '../tabs-usuario/tabs-usuario.component';


// Interfaces
import { Provincia } from 'src/app/interfaces/provincia/provincia';
import { Canton } from 'src/app/interfaces/canton/canton';
import { Parroquia } from 'src/app/interfaces/parroquia/parroquia';
import { Comunidad } from 'src/app/interfaces/comunidad/comunidad';

// Services
import { PersonaService } from 'src/app/services/persona.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-persona-localizacion',
  templateUrl: './persona-localizacion.component.html',
  styleUrls: ['./persona-localizacion.component.css']
})
export class PersonaLocalizacionComponent implements OnInit {

  constructor(private personaService: PersonaService,
    private router: Router,
    @Inject(TabsUsuarioComponent) private tabsUsuarioComponent: TabsUsuarioComponent ) { }

  botonAgregarNumero = false;
  canton = '0';
  claseBotonSiguientePasoIfPersona = "form-control btn-success";
  comunidad = '0';
  correo: string;
  nombreBotonSiguientePasoIfPersona = "Siguiente Paso";
  parroquia = '0';
  numeroExtra = true;
  provincia = '0';
  telefono1: string;
  telefono2: string;
  telefono3: string;

  cantones: Canton[] = [];
  comunidades: Comunidad[] = [];
  parroquias: Parroquia[] = [];
  provincias: Provincia[] = [];

  agregarTelefono(){
    console.log('worked');
    if(this.numeroExtra == true){
      this.numeroExtra = false;
      this.botonAgregarNumero = true;
    }
  }

  quitarTelefono(){
    console.log('worked');
    if(this.numeroExtra == false){
      this.numeroExtra = true;
      this.botonAgregarNumero = false;
    }
  }

  consultarProvincias(){
    this.personaService.consultarProvincias (localStorage.getItem('miCuenta.getToken'))
    .then(
      ok => {
        this.provincias = ok['respuesta'];
        console.log(this.provincias);
      }
    )
    .catch(
      err => {
        console.log(err);
      }
    ) 
  }

  consultarCantones(){
    this.personaService.consultarCantones (localStorage.getItem('miCuenta.getToken'))
    .then(
      ok => {
        this.cantones = ok['respuesta'];
        console.log(this.cantones);
      }
    )
    .catch(
      err => {
        console.log(err);
      }
    ) 
  }

  consultarParroquias(){
    this.personaService.consultarParroquias (localStorage.getItem('miCuenta.getToken'))
    .then(
      ok => {
        this.parroquias = ok['respuesta'];
        console.log(this.parroquias);
      }
    )
    .catch(
      err => {
        console.log(err);
      }
    ) 
  }

  consultarComunidades(){
    this.personaService.consultarComunidades (localStorage.getItem('miCuenta.getToken'))
    .then(
      ok => {
        this.comunidades = ok['respuesta'];
        console.log(this.comunidades);
      }
    )
    .catch(
      err => {
        console.log(err);
      }
    ) 
  }
  
  changeTabIndexAv(){
    this.tabsUsuarioComponent.changeTabIndex(1);
  }

  changeTabIndexRe(){
    this.tabsUsuarioComponent.changeTabIndex(-1);
  }

  ngOnInit() {
    if (this.router.url == '/inicio/personas') {
      this.claseBotonSiguientePasoIfPersona = "form-control btn-primary";
      this.nombreBotonSiguientePasoIfPersona = "Guardar Persona";
    } 
  }

}
