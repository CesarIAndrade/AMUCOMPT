import { Component, OnInit, Inject } from '@angular/core';

// Services
import { PersonaService } from "../../services/persona.service";

// Interfaces
import { Persona } from "../../interfaces/persona/persona";
import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";

// Components
import { TabsUsuarioComponent } from '../tabs-usuario/tabs-usuario.component';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(
    private personaService: PersonaService,
    @Inject(TabsUsuarioComponent) private tabsUsuarioComponent: TabsUsuarioComponent ) { }

  apellidos: string;
  nombres: string;
  numeroDocumento: string;
  tipoDocumento: string = '0';

  personas: Persona[] = [];
  tipoDocumentos: TipoDocumentos[] = [];

  consultarPersonas(){
    this.personaService.consultarPersonas(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.personas = ok['respuesta'];
          console.log(this.personas);
        },
        err => console.log(err)
      )
  }

  consultarTipoDocumentos(){
    this.personaService.consultatTipoDocumentos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoDocumentos = ok['respuesta'];
          console.log(this.tipoDocumentos);
        },
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  changeTabIndex(){
    this.tabsUsuarioComponent.changeTabIndex(1);
  }

  ngOnInit() {
    // this.consultarPersonas();
    // this.consultarTipoDocumentos();
  }

}
