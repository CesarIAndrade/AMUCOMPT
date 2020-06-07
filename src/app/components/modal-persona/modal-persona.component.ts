import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-modal-persona',
  templateUrl: './modal-persona.component.html',
  styleUrls: ['./modal-persona.component.css']
})
export class ModalPersonaComponent implements OnInit {

  constructor(
    private modalPersonaComponent: MatDialogRef<ModalPersonaComponent>
  ) { }

  ngOnInit() {
  }

  datosPersona = {
    cedula: "",
    idPersona: "",
    nombres: "",
    apellidos: "",
  };

  obtenerPersona(persona) {
    this.datosPersona.cedula = persona.NumeroDocumento;
    this.datosPersona.idPersona = persona.IdPersona;
    this.datosPersona.nombres =
      persona.PrimerNombre + " " + persona.SegundoNombre;
    this.datosPersona.apellidos =
      persona.ApellidoPaterno + " " + persona.ApellidoMaterno;
    this.modalPersonaComponent.close(this.datosPersona);
  }

}
