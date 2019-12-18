import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// Interfaces
import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { Persona } from 'src/app/interfaces/persona/persona';
import { Correo } from 'src/app/interfaces/correo/correo';
import { Telefono } from 'src/app/interfaces/telefono/telefono';
import { Usuario } from 'src/app/interfaces/usuario/usuario';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  constructor(private tipoDocumentoService: TipoDocumentoService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  @Input() item = {};
  persona: Persona = {};
  correo: Correo = {};
  telefono: Telefono = {}
  usuario: Usuario = {}

  apellidos: string;
  botonAgregarNumero: boolean = false;
  correoModal: string;
  nombres: string;
  numeroDocumento: string;
  numeroExtra: boolean = true;
  telefonoModal1: string;
  telefonoModal2: string;
  telefonoModal3: string;
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

  guardarDatosPersona() {
    // let arrayNombres = this.nombres.split(' ');
    // let arrayApellidos = this.apellidos.split(' ');
    // this.usuario.Persona.ApellidoPaterno = arrayApellidos[0];
    // this.usuario.Persona.ApellidoMaterno = arrayApellidos[1];
    // this.usuario.Persona.PrimerNombre = arrayNombres[0];
    // this.usuario.Persona.SegundoNombre = arrayNombres[1];
    // this.usuario.Persona.TipoDocumentos.IdTipoDocumento = this.tipoDocumento;
    // this.usuario.Persona.NumeroDocumento = this.numeroDocumento;
    // this.correo.CorreoValor = this.correoModal;
    // this.telefono.Numero = this.telefonoModal;
  }

  ngOnInit() {
    this.consultarTipoDocumentos();
  }

}
