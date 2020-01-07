import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from "@angular/material/dialog";

// Services
import { PersonaService } from "src/app/services/persona.service";

// Interfaces
import { TipoDocumento } from "../../interfaces/tipo-documento/tipo-documento";
import { PersonaModal } from "../../interfaces/persona/persona-modal";

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  constructor(private personaService: PersonaService,
    @Inject(MAT_DIALOG_DATA) private data: PersonaModal,
    public dialogRef: MatDialogRef<ModalUsuarioComponent>
  ) { }

  botonAgregarNumero: boolean = false;
  numeroExtra: boolean = true;
  persona: PersonaModal = {
    nombresModal: '',
    apellidosModal: '',
    tipoDocumentoModal: '',
    numeroDocumentoModal: '',
    telefonoModal1: '',
    telefonoModal2: '',
    correoModal: '',
  };
  tipoDocumentos: TipoDocumento[] = [];

  consultarTipoDocumentos() {
    this.personaService.consultarTipoDocumento(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoDocumentos = ok['respuesta'];
          console.log(this.tipoDocumentos);
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  agregarTelefono(){
    console.log('worked');
    if(this.numeroExtra == true){
      this.numeroExtra = false;
      this.botonAgregarNumero = true;
    }
  }

  quitarTelefono(){
    console.log('worked');
    if(this.numeroExtra == false){
      this.numeroExtra = true;
      this.botonAgregarNumero = false;
    }
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.consultarTipoDocumentos();
  }

}
