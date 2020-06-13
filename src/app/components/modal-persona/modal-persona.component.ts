import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-modal-persona",
  templateUrl: "./modal-persona.component.html",
  styleUrls: ["./modal-persona.component.css"],
})
export class ModalPersonaComponent implements OnInit {
  constructor(
    private modalPersonaComponent: MatDialogRef<ModalPersonaComponent>,
    private router: Router
  ) {}

  crearPersona = false;
  renderizarTablaOriginal: string;

  mostrarFormularioPersona() {
    if (this.crearPersona) {
      this.crearPersona = false;
    } else {
      this.crearPersona = true;
    }
  }

  ngOnInit() {
    this.router.url == "/ventas"
      ? (this.renderizarTablaOriginal = "false")
      : (this.renderizarTablaOriginal = "true");
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
