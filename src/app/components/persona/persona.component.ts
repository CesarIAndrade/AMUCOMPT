import { Component, OnInit } from '@angular/core';
import { PersonaService } from "../../services/persona.service";
import { persona } from "../../interfaces/persona";
@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(private personaService: PersonaService ) { }

  personas:any;
  consultarPersonas(){
    this.personaService.consultarPersonas()
      .subscribe(
        data => {this.personas = data;
        console.log(typeof(this.personas))},
        err => {console.log(err)}
      )
  }

  ngOnInit() {
    this.consultarPersonas();
  }

}
