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
import { MatDialog, MatTableDataSource, MatPaginator } from "@angular/material";
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";

@Component({
  selector: "app-canton",
  templateUrl: "./canton.component.html",
  styleUrls: ["./canton.component.css"],
})
export class CantonComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private modalLocalidadSuperior: MatDialog
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
  filterProvincia = "";
  filterCanton = "";

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  cantones = new MatTableDataSource<Element[]>();

  consultarCantones() {
    this.panelAdministracionService
      .consultarCantones(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.cantones.data = [];
        this.cantones.data = ok["respuesta"];
        this.cantones.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
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

  crearCanton() {
    this.panelAdministracionService
      .crearCanton(
        this.myForm.get("_idProvincia").value,
        this.myForm.get("_canton").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.myForm.reset();
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
          this.myForm.reset();
          this.consultarCantones();
        }
      })
      .catch((error) => console.log(error));
  }

  actualizarCanton() {
    this.panelAdministracionService
      .actualizarCanton(
        this.myForm.get("_idProvincia").value,
        this.myForm.get("_idCanton").value,
        this.myForm.get("_canton").value,
        localStorage.getItem("miCuenta.putToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.myForm.reset();
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
          this.botonIngresar = "ingresar";
          this.myForm.reset();
          this.consultarCantones();
        }
      })
      .catch((error) => console.log(error));
  }

  eliminarCanton(idCanton: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ["Cancelar", "Ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.panelAdministracionService
          .eliminarCanton(
            idCanton,
            localStorage.getItem("miCuenta.deleteToken")
          )
          .then((ok) => {
            if (ok["respuesta"]) {
              sweetAlert("Se ha eliminado correctamente!", {
                icon: "success",
              });
              this.consultarCantones();
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
