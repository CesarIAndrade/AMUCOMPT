import { Component, OnInit } from '@angular/core';
import { PersonaService } from "../../services/persona.service";

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor(private personaService: PersonaService ) { }

  personas: any;
  consultarPersonas(){
    this.personaService.consultarPersonas()
      .subscribe(
        data => {console.log(data)},
        err => {console.log(err)}
      )
  }

  ngOnInit() {
    this.consultarPersonas();
  }

}
