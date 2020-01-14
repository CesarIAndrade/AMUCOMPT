import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-usuario',
  templateUrl: './modal-detalle-usuario.component.html',
  styleUrls: ['./modal-detalle-usuario.component.css']
})
export class ModalDetalleUsuarioComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    console.log(data)
  }

  listaTipoUsuario = this.data.listaTipoUsuario;

  ngOnInit() {
  }

}
