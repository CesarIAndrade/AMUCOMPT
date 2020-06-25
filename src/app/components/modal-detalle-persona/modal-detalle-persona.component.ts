import { Component, OnInit, Inject } from "@angular/core";

// Material
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-modal-detalle-persona",
  templateUrl: "./modal-detalle-persona.component.html",
  styleUrls: ["./modal-detalle-persona.component.css"],
})
export class ModalDetallePersonaComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  persona = {
    nombres: "",
    documento: "",
    tipoDocumento: "",
    telefonos: [],
    correo: "",
    direccion: "",
    referencia: "",
  };

  ngOnInit() {
    var nombres =
      this.data.persona.PrimerNombre +
      " " +
      this.data.persona.SegundoNombre +
      " " +
      this.data.persona.ApellidoPaterno +
      " " +
      this.data.persona.ApellidoMaterno;
    var documento = this.data.persona.NumeroDocumento;
    var tipoDocumento = this.data.persona.TipoDocumento;

    var telefonos = [];
    var referencia = "Sin Referencia";
    var direccion = "Sin Dirección";
    var correo = "Sin Correo";

    try {
      this.data.persona.ListaTelefono.map((telefono) => {
        telefonos.push(telefono);
      });
      if (this.data.persona.AsignacionPersonaParroquia.length != 0) {
        referencia = String(
          this.data.persona.AsignacionPersonaParroquia[0].Referencia
        ).toUpperCase();
        direccion =
          this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton
            .Provincia.Descripcion +
          " - " +
          this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Canton
            .Descripcion +
          " - " +
          this.data.persona.AsignacionPersonaParroquia[0].Parroquia.Descripcion;
      }
      if (this.data.persona.ListaCorreo.length != 0) {
        correo = this.data.persona.ListaCorreo[0].CorreoValor;
      }
    } catch (error) {
      console.log(error);
    }

    this.persona = {
      nombres: nombres,
      documento: documento,
      tipoDocumento: tipoDocumento,
      telefonos: telefonos,
      correo: correo,
      direccion: direccion,
      referencia: referencia,
    };
  }
}
