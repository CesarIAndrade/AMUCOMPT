import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatTableDataSource,
  MatPaginator,
} from "@angular/material";
import { InventarioService } from "src/app/services/inventario.service";

@Component({
  selector: "app-modal-lotes",
  templateUrl: "./modal-lotes.component.html",
  styleUrls: ["./modal-lotes.component.css"],
})
export class ModalLotesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventarioService: InventarioService
  ) {}

  permitirCrearLote = true;

  lote = {
    nombreLote: "",
    fechaExpiracion: "",
    idLote: "",
  };

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  lotes = new MatTableDataSource<Element[]>();

  consultarLotesDeUnProducto() {
    this.inventarioService
      .consultarLotesDeUnProducto(
        this.data.idCabecera,
        this.data.idRelacionLogica,
        this.data.perteneceKit,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          console.log(ok["respuesta"]);
          this.lotes.data = [];
          this.lotes.data = ok["respuesta"];
          this.lotes.paginator = this.paginator;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  keyUp(){
    if(this.lote.nombreLote != "" && this.lote.fechaExpiracion != "") {
      this.permitirCrearLote = false;
    }
  }

  change() {
    if(this.lote.nombreLote != "" && this.lote.fechaExpiracion != "") {
      this.permitirCrearLote = false;
    }
  }

  validarFormulario() {
    if(this.lote.nombreLote == "" || this.lote.fechaExpiracion == "") {

    } else {
      this.crearLote();
    }
  }

  crearLote() {
    this.inventarioService
      .crearLote(
        this.lote.nombreLote,
        "0",
        this.validarFecha(),
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          this.lote.idLote = ok["respuesta"];
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  validarFecha(fecha?) {
    var fechaExpiracion: any;
    if (fecha) {
      fechaExpiracion = fecha;
    } else {
      fechaExpiracion = new Date(this.lote.fechaExpiracion);
    }
    var fechaActual = new Date();
    try {
      if (fechaExpiracion.getFullYear() < fechaActual.getFullYear()) {
        fechaExpiracion = null;
      } else {
        fechaExpiracion = fechaExpiracion.toJSON();
        fechaExpiracion = fechaExpiracion.split("T")[0];
        return fechaExpiracion;
      }
    } catch (error) {
      return (fechaExpiracion = null);
    }
  }

  setLote(lote) {
    this.lote.idLote = lote.IdLote;
    this.lote.nombreLote = lote.Codigo;
    this.lote.fechaExpiracion = lote.FechaExpiracion;
  }

  ngOnInit() {
    this.consultarLotesDeUnProducto();
  }

  tabla = ["lote", "capacidad", "fechaExpiracion", "acciones"];
}
