import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

// SweetAlert
import sweetalert from "sweetalert";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";

@Component({
  selector: "app-parroquia",
  templateUrl: "./parroquia.component.html",
  styleUrls: ["./parroquia.component.css"],
})
export class ParroquiaComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog
  ) {
    this.myForm = new FormGroup({
      _idParroquia: new FormControl(""),
      _parroquia: new FormControl("", [Validators.required]),
      _idCanton: new FormControl("", [Validators.required]),
      _canton: new FormControl(""),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  filterParroquia = "";

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  parroquias = new MatTableDataSource<Element[]>();

  consultarParroquias() {
    this.panelAdministracionService
      .consultarParroquias(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.parroquias.data = [];
        this.parroquias.data = ok["respuesta"];
        this.parroquias.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.crearParroquia();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarParroquia();
      }
    }
  }

  crearParroquia() {
    this.panelAdministracionService
      .crearParroquia(
        this.myForm.get("_idCanton").value,
        this.myForm.get("_parroquia").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.limpiarCampos();
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Cantón ya existe!", {
            icon: "warning",
          });
        } else if (ok["respuesta"] == "false") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.limpiarCampos();
          this.consultarParroquias();
        }
      })
      .catch((error) => console.log(error));
  }

  actualizarParroquia() {
    this.panelAdministracionService
      .actualizarParroquia(
        this.myForm.get("_idCanton").value,
        this.myForm.get("_idParroquia").value,
        this.myForm.get("_parroquia").value,
        localStorage.getItem("miCuenta.putToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.limpiarCampos();
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Cantón ya existe!", {
            icon: "warning",
          });
        } else if (ok["respuesta"] == "false") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.limpiarCampos();
          this.consultarParroquias();
          this.botonIngresar = "ingresar";
        }
      })
      .catch((error) => console.log(error));
  }

  eliminarParroquia(idParroquia: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ["Cancelar", "Ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.panelAdministracionService
          .eliminarParroquia(
            idParroquia,
            localStorage.getItem("miCuenta.deleteToken")
          )
          .then((ok) => {
            if (ok["respuesta"]) {
              sweetAlert("Se ha eliminado correctamente!", {
                icon: "success",
              });
              this.consultarParroquias();
            } else {
              sweetAlert("No se ha podido elminiar!", {
                icon: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }

  abrirModal() {
    let dialogRef = this.modalLocalidadSuperior.open(
      ModalLocalidadSuperiorComponent,
      {
        width: "400px",
        height: "auto",
        data: {
          ruta: "parroquias",
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_idCanton").setValue(result.idLocalidad);
        this.myForm.get("_canton").setValue(result.descripcion);
      }
    });
  }

  limpiarCampos() {
    this.myForm.reset();
    this.myForm.get("_canton").setValue("Cantón");
  }

  mostrarParroquia(parroquia) {
    this.myForm.get("_idParroquia").setValue(parroquia.IdParroquia);
    this.myForm.get("_parroquia").setValue(parroquia.Descripcion);
    this.myForm.get("_idCanton").setValue(parroquia.Canton.IdCanton);
    this.myForm.get("_canton").setValue(parroquia.Canton.Descripcion);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarParroquias();
  }

  tablaParroquias = ["parroquia", "canton", "acciones"];
}
