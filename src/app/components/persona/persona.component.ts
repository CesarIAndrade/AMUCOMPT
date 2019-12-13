import { Component, OnInit } from '@angular/core';
import { PersonaService } from "../../services/persona.service";
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
        data => {this.personas = data.respuesta;
        console.log(this.personas)},
        err => {console.log(err)}
      )
  }

  ngOnInit() {
    this.consultarPersonas();
  }

}
