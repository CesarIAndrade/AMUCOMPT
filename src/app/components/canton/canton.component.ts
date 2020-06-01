import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog, MatTableDataSource, MatPaginator, MatSnackBar } from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

// Components
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

@Component({
  selector: "app-canton",
  templateUrl: "./canton.component.html",
  styleUrls: ["./canton.component.css"],
})
export class CantonComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idCanton: new FormControl(""),
      _canton: new FormControl("", [Validators.required]),
      _idProvincia: new FormControl("", [Validators.required]),
      _provincia: new FormControl(""),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  filterCanton = "";

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  cantones = new MatTableDataSource<Element[]>();

  openDialog(mensaje): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 2000,
      horizontalPosition: "right",
    });
  }

  async consultarCantones() {
    var cantones = await this.panelAdministracionService.consultarCantones();
    if (cantones["codigo"] == "200") {
      this.cantones.data = cantones["respuesta"];
      this.cantones.paginator = this.paginator;
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.crearCanton();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarCanton();
      }
    }
  }

  async crearCanton() {
    var canton = await this.panelAdministracionService.crearCanton(
      this.myForm.get("_idProvincia").value,
      this.myForm.get("_canton").value
    );
    console.log(canton);
    // .then((ok) => {
    //   if (ok["respuesta"] == null) {
    //     sweetAlert("Inténtalo de nuevo!", {
    //       icon: "warning",
    //     });
    //     this.myForm.reset();
    //   } else if (ok["respuesta"] == "400") {
    //     sweetAlert("Cantón ya existe!", {
    //       icon: "warning",
    //     });
    //   } else if (ok["respuesta"] == "false") {
    //     sweetAlert("Ha ocurrido un error!", {
    //       icon: "error",
    //     });
    //   } else {
    //     sweetAlert("Se ingresó correctamente!", {
    //       icon: "success",
    //     });

    //   }
    // })
    // .catch((error) => console.log(error));
  }

  async actualizarCanton() {
    var canton = await this.panelAdministracionService.actualizarCanton(
      this.myForm.get("_idProvincia").value,
      this.myForm.get("_idCanton").value,
      this.myForm.get("_canton").value
    );
    console.log(canton);
    // .then((ok) => {
    //   if (ok["respuesta"] == null) {
    //     sweetAlert("Inténtalo de nuevo!", {
    //       icon: "warning",
    //     });
    //     this.myForm.reset();
    //   } else if (ok["respuesta"] == "400") {
    //     sweetAlert("Cantón ya existe!", {
    //       icon: "warning",
    //     });
    //   } else if (ok["respuesta"] == "false") {
    //     sweetAlert("Ha ocurrido un error!", {
    //       icon: "error",
    //     });
    //   } else {
    //     sweetAlert("Se ingresó correctamente!", {
    //       icon: "success",
    //     });
    //     this.botonIngresar = "ingresar";
    //     this.myForm.reset();
    //     this.consultarCantones();
    //   }
    // })
    // .catch((error) => console.log(error));
  }

  async eliminarCanton(idCanton: string) {
    var respuesta = await this.panelAdministracionService;
    console.log(respuesta);
  }

  abrirModal() {
    let dialogRef = this.modalLocalidadSuperior.open(
      ModalLocalidadSuperiorComponent,
      {
        width: "400px",
        height: "auto",
        data: {
          ruta: "cantones",
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_idProvincia").setValue(result.idLocalidad);
        this.myForm.get("_provincia").setValue(result.descripcion);
      }
    });
  }

  mostrarCanton(canton) {
    this.myForm.get("_idCanton").setValue(canton.IdCanton);
    this.myForm.get("_canton").setValue(canton.Descripcion);
    this.myForm.get("_idProvincia").setValue(canton.Provincia.IdProvincia);
    this.myForm.get("_provincia").setValue(canton.Provincia.Descripcion);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarCantones();
  }

  tablaCantones = ["canton", "provincia", "acciones"];
}
