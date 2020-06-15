import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  correo = "";
  referencia = String(this.data.persona.AsignacionPersonaParroquia[0].Referencia).toUpperCase();
  direccion =
    this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia
      .Descripcion +
    " - " +
    this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton
      .Descripcion +
    " - " +
    this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Descripcion;


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
      !this.direccion
    ) {
      this.referencia = "Sin Referencia";
      this.direccion = "Sin Direccion";
    }
  }
}
