import { Component, OnInit } from '@angular/core';

// Services
import { PersonaService } from "../../services/persona.service";

// Interfaces
import { Persona } from "../../interfaces/persona/persona";

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(private personaService: PersonaService ) { }

  personas: Persona[] = [];
  consultarPersonas(){
    this.personaService.consultarPersonas()
      .subscribe(
        data => {
          this.personas = data.respuesta;
          console.log(data.respuesta);
      },
        err => {console.log(err)}
      )
  }

  ngOnInit() {
    this.consultarPersonas();
  }

}
