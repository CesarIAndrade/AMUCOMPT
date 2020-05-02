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
    precio: ""
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

  setLote(lote) {
    this.lote.idLote = lote.IdLote;
    this.lote.nombreLote = lote.Codigo;
    this.lote.fechaExpiracion = lote.FechaExpiracion;
    this.lote.precio = lote.AsignarProductoLote.ValorUnitario;
  }

  ngOnInit() {
    this.consultarLotesDeUnProducto();
  }

  tabla = ["lote", "capacidad", "fechaExpiracion", "acciones"];
}
