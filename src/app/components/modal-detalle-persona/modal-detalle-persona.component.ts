import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonaModal } from 'src/app/interfaces/persona/persona-modal';

@Component({
  selector: 'app-modal-detalle-persona',
  templateUrl: './modal-detalle-persona.component.html',
  styleUrls: ['./modal-detalle-persona.component.css']
})
export class ModalDetallePersonaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalDetallePersonaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { console.log(data) }

  nombresCompletos = this.data.persona.PrimerNombre + ' ' +
    this.data.persona.SegundoNombre + ' ' +
    this.data.persona.ApellidoPaterno + ' ' +
    this.data.persona.ApellidoMaterno;

  provincia = this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia.Descripcion;
  canton = this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Descripcion;
  parroquia = this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Descripcion;

  direccion = this.provincia + ' > ' +
    this.canton + ' > ' +
    this.parroquia;

  sinNumero = 'Sin Numero';
  sinCorreo = 'Sin Correo';
  sinDireccion: string;

  ngOnInit() {
    if (this.provincia == null || this.canton == null ||
      this.parroquia == null) {
      this.direccion = 'Sin Direccion';
    }
  }

}
