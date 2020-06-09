import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-modal-detalle-persona",
  templateUrl: "./modal-detalle-persona.component.html",
  styleUrls: ["./modal-detalle-persona.component.css"],
})
export class ModalDetallePersonaComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  nombresCompletos =
    this.data.persona.PrimerNombre +
    " " +
    this.data.persona.SegundoNombre +
    " " +
    this.data.persona.ApellidoPaterno +
    " " +
    this.data.persona.ApellidoMaterno;

  provincia = this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton
    .Provincia.Descripcion;
  canton = this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton
    .Descripcion;
  parroquia = this.data.persona.AsignacionPersonaParroquia[0].Parroquia
    .Descripcion;

  correo = "";
  direccion = this.provincia + " > " + this.canton + " > " + this.parroquia;

  sinNumero = "Sin Numero";
  sinCorreo = "Sin Correo";
  sinDireccion: string;

  ngOnInit() {
    if (this.data.persona.ListaCorreo.length == 0) {
      this.correo = "Sin Correo";
    } else {
      this.correo = this.data.persona.ListaCorreo[0].CorreoValor;
    }
    if (
      this.provincia == null ||
      this.canton == null ||
      this.parroquia == null
    ) {
      this.direccion = "Sin Direccion";
    }
  }
}
