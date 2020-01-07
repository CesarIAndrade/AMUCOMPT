import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PersonaModal } from 'src/app/interfaces/persona/persona-modal';

@Component({
  selector: 'app-modal-detalle-persona',
  templateUrl: './modal-detalle-persona.component.html',
  styleUrls: ['./modal-detalle-persona.component.css']
})
export class ModalDetallePersonaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalDetallePersonaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonaModal
  ) {}

  nombresCompletos = this.data.primerNombreModal + ' ' + 
    this.data.segundoNombreModal + ' ' +
    this.data.apellidoPaternoModal + ' '+ 
    this.data.apellidoMaternoModal;


  direccion = this.data.provinciaModal + ' -> ' +
    this.data.cantonModal + ' -> ' +
    this.data.parroquiaModal + ' -> ' +
    this.data.comunidadModal;
    
  sinNumero = 'Sin Numero';
  sinCorreo = 'Sin Correo';
  sinDireccion  = 'Sin Direccion';

  ngOnInit() {
    if(this.data.provinciaModal == null || this.data.cantonModal == null ||
      this.data.parroquiaModal == null || this.data.comunidadModal == null) {
        this.direccion = 'Sin Direccion';
      }
  }

}
