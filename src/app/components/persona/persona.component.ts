import { Component, OnInit } from '@angular/core';

// Services
import { PersonaService } from "../../services/persona.service";

// Interfaces
import { Usuario } from "../../interfaces/usuario/usuario";
import { UsuariosResult } from 'src/app/interfaces/usuario/usuarios-result';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(private personaService: PersonaService ) { }

  personas: Usuario[] = [];
  consultarPersonas(){
    this.personaService.consultarPersonas()
      .subscribe(
        data => {
          //console.log(data);
          this.personas = data.respuesta;
          console.log(this.personas);
      },
        err => {console.log(err)}
      )
  }

  ngOnInit() {
    this.consultarPersonas();
  }

}
