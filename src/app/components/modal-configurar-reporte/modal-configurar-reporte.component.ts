import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RubrosService } from "src/app/services/rubros.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ModalPersonaComponent } from "../modal-persona/modal-persona.component";
import { reportsUrl } from "../../../environments/environment";

@Component({
  selector: "app-modal-configurar-reporte",
  templateUrl: "./modal-configurar-reporte.component.html",
  styleUrls: ["./modal-configurar-reporte.component.css"],
})
export class ModalConfigurarReporteComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private rubrosService: RubrosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.myForm = new FormGroup({
      _fechaInicio: new FormControl(""),
      _fechaFin: new FormControl(""),
      _cliente: new FormControl(""),
      _idCliente: new FormControl(""),
      _rubro: new FormControl(""),
      _cedula: new FormControl(""),
    });
  }

  rubros: any[] = [
    {
      Identificador: '1',
      Descripcion: 'Carro'
    },
    {
      Identificador: '2',
      Descripcion: 'Saco'
    }
  ];
  porCliente: boolean;
  general: boolean;
  fechas: boolean;

  opciones = [
    {
      _id: "1",
      descripcion: "General",
      checked: true
    },
    {
      _id: "2",
      descripcion: "Por fecha",
      checked: false
    }
  ];

  selecionarOpcion(opcion) {
    opcion['_id'] == "2" ? this.mostrarFechas() : this.ocultarFechas();
  }


  ngOnInit() {
    if (this.data.rol == "secreteria") {
      if (this.data.id == 7) {
        this.requerirCliente();
      }
    } else if (this.data.rol == "administrador") {
      if (this.data.id == 1) {
        this.especificarRubro();
      } else if (this.data.id == 3) {
        this.requerirCliente();
      }
    }
  }

  irAlReporte() {
    if (this.myForm.valid) {
      if (this.data.rol == "secreteria") {
        if (this.data.id == 7) {
          var url = `${this.data.url}?Persona=${this.myForm.get(
            "_idCliente"
          ).value}`;
        } else if (!this.fechas) {
          var url = `${this.data.url}?general=1`;
        } else {
          var fechaInicio = this.getDate(this.myForm.get("_fechaInicio").value);
          var fechaFin = this.getDate(this.myForm.get("_fechaFin").value);
          var url = `${this.data.url}?Inicio=${fechaInicio}&Fin=${fechaFin}&general=0`;
        }
      } else {
        var fechaInicio = this.getDate(this.myForm.get("_fechaInicio").value);
        var fechaFin = this.getDate(this.myForm.get("_fechaFin").value);
        if (this.myForm.get("_rubro").value) {
          var rubro = this.myForm.get("_rubro").value;
          if (!this.fechas) {
            var url = `${this.data.url}?Identificador=${rubro}&general=1`;
          } else {
            var fechaInicio = this.getDate(this.myForm.get("_fechaInicio").value);
            var fechaFin = this.getDate(this.myForm.get("_fechaFin").value);
            var url = `${this.data.url}?Identificador=${rubro}&Inicio=${fechaInicio}&Fin=${fechaFin}&general=0`;
          }
        } else if (this.myForm.get("_cedula").value) {
          var cliente = this.myForm.get("_cedula").value;
          if (!this.fechas) {
            var url = `${this.data.url}?Identificador=${cliente}&general=1`;
          } else {
            var fechaInicio = this.getDate(this.myForm.get("_fechaInicio").value);
            var fechaFin = this.getDate(this.myForm.get("_fechaFin").value);
            var url = `${this.data.url}?Identificador=${cliente}&Inicio=${fechaInicio}&Fin=${fechaFin}&general=0`;
          }
        } else {
          if (!this.fechas) {
            var url = `${this.data.url}?general=1`;
          } else {
            var fechaInicio = this.getDate(this.myForm.get("_fechaInicio").value);
            var fechaFin = this.getDate(this.myForm.get("_fechaFin").value);
            var url = `${this.data.url}?Inicio=${fechaInicio}&Fin=${fechaFin}&general=0`;
          }
        }
        window.open(reportsUrl + url);
      }
    }
  }

  seleccionarCliente() {
    let dialogRef = this.dialog.open(ModalPersonaComponent, {
      width: "auto",
      height: "auto",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var cliente = result.nombres + " " + result.apellidos;
        this.myForm.get("_cliente").setValue(cliente);
        this.myForm.get("_cedula").setValue(result.cedula);
        this.myForm.get("_idCliente").setValue(result.idPersona);
      }
    });
  }

  getDate(fecha) {
    var _fecha = new Date(fecha);
    var dia, mes: string;
    if (_fecha.getDate() < 10) {
      dia = `0${_fecha.getDate()}`;
    } else {
      dia = _fecha.getDate();
    }
    if (_fecha.getMonth() + 1 < 10) {
      mes = `0${_fecha.getMonth() + 1}`;
    } else {
      mes = `${_fecha.getMonth() + 1}`;
    }
    // return `${dia}-${mes}-${_fecha.getFullYear()}`;
    return `${_fecha.getFullYear()}-${mes}-${dia}`;
  }

  mostrarFechas() {
    this.myForm.get("_fechaInicio").setValidators([Validators.required]);
    this.myForm.get("_fechaInicio").updateValueAndValidity();
    this.myForm.get("_fechaFin").setValidators([Validators.required]);
    this.myForm.get("_fechaFin").updateValueAndValidity();
    this.fechas = true;
  }

  ocultarFechas() {
    this.myForm.get("_fechaInicio").clearValidators();
    this.myForm.get("_fechaInicio").updateValueAndValidity();
    this.myForm.get("_fechaFin").clearValidators();
    this.myForm.get("_fechaFin").updateValueAndValidity();
    this.fechas = false;
  }



  requerirCliente() {
    this.myForm.get("_cliente").setValidators([Validators.required]);
    this.myForm.get("_cliente").updateValueAndValidity();
    this.porCliente = true;
  }

  especificarRubro() {
    this.myForm.get("_rubro").setValidators([Validators.required]);
    this.myForm.get("_rubro").updateValueAndValidity();
    this.general = true;
  }
}
