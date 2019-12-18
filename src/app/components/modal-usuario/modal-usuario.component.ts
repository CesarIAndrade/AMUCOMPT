import { Component, OnInit } from '@angular/core';

// Interfaces
import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  constructor(private tipoDocumentoService: TipoDocumentoService) { }

  tipoDocumento: string = "0";
  tipoDocumentos: TipoDocumentos[] = [];

  consultarTipoDocumentos() {
    this.tipoDocumentoService.consultatTipoDocumentos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok);
          this.tipoDocumentos = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  ngOnInit() {
    this.consultarTipoDocumentos();
  }

}
