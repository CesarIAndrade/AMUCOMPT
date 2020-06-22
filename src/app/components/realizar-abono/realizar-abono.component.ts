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
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

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

  openDialog(mensaje, icono): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje, icono: icono },
    });
  }

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
          if(respuesta["codigo"] == "200") {
            this.seguimientoService.refresh$.emit();
            this.myForm.reset();
            this.dialog.closeAll();
          }
          if (respuesta["codigo"] == "201") {
            this.seguimientoService.refresh$.emit();
            this.myForm.reset();
            this.consultarAbonos();
          } else if (respuesta["codigo"] == "418") {
            this.openDialog(respuesta["mensaje"], "advertencia");
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
