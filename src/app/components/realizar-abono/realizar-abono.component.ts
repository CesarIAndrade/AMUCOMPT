import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

// Components
import { ComfirmDialogComponent } from "../comfirm-dialog/comfirm-dialog.component";

// Material
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatTableDataSource,
  MatPaginator,
} from "@angular/material";

// Services
import { SeguimientoService } from "src/app/services/seguimiento.service";

@Component({
  selector: "app-realizar-abono",
  templateUrl: "./realizar-abono.component.html",
  styleUrls: ["./realizar-abono.component.css"],
})
export class RealizarAbonoComponent implements OnInit {
  myForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private seguimientoService: SeguimientoService,
    private dialog: MatDialog
  ) {
    if (data.flag) {
      this.sinForm = "col-lg-8 col-md-7";
    } else {
      this.sinForm = "col-12";
    }
    this.myForm = new FormGroup({
      _monto: new FormControl("", [
        Validators.required,
        // Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]),
    });
  }

  sinForm: string;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  abonos = new MatTableDataSource<Element[]>();

  async realizarAbono() {
    let dialogRef = this.dialog.open(ComfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: ""
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (this.myForm.valid) {
          var respuesta = await this.seguimientoService.realizarAbono(
            localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
            this.data.idConfigurarVenta,
            this.myForm.get("_monto").value
          );
          console.log(respuesta);
          if (respuesta["codigo"] == "201" || respuesta["codigo"] == "200") {
            this.seguimientoService.refresh$.emit();
            this.dialog.closeAll();
            this.consultarAbonos();
          }
        }
      }
    });
  }

  async consultarAbonos() {
    var respuesta = await this.seguimientoService.consultarAbonos(
      this.data.idConfigurarVenta
    );
    if (respuesta["codigo"] == "200") {
      this.abonos.data = respuesta["respuesta"];
      this.abonos.paginator = this.paginator;
    }
  }

  ngOnInit() {
    this.consultarAbonos();
  }

  tablaAbonos = ["fechaRegistro", "monto"];
}
