import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { salir, openDialog, openSnackBar } from '../../functions/global';

// Components
import { ModalLocalidadSuperiorComponent } from "../modal-localidad-superior/modal-localidad-superior.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

// Material
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSnackBar
} from "@angular/material";

// Services
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { Router } from '@angular/router';

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
    private router: Router,
    private snackBar: MatSnackBar
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
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  cantones = new MatTableDataSource<Element[]>();

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.cantones.filter = term;
  }

  async consultarCantones() {
    var respuesta = await this.panelAdministracionService.consultarCantones();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var cantones: any = [];
      respuesta["respuesta"].map((canton) => {
        cantones.push({
          IdProvincia: canton.Provincia.IdProvincia,
          Provincia: canton.Provincia.Descripcion,
          IdCanton: canton.IdCanton,
          Descripcion: canton.Descripcion,
          PermitirEliminacion: canton.PermitirEliminacion,
        });
      });
      this.cantones.data = cantones;
      this.cantones.paginator = this.paginator;
    } else if (respuesta["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir())
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
    if (canton["codigo"] == "200") {
      var cantones: any = this.cantones.data;
      cantones.push({
        IdProvincia: canton["respuesta"].Provincia.IdProvincia,
        Provincia: canton["respuesta"].Provincia.Descripcion,
        IdCanton: canton["respuesta"].IdCanton,
        Descripcion: canton["respuesta"].Descripcion,
        PermitirEliminacion: canton["respuesta"].PermitirEliminacion,
      });
      this.cantones.data = cantones;
      this.myForm.reset();
      this.panelAdministracionService.refresh$.emit();
      openSnackBar("Se ingresó correctamente", this.snackBar);
    } else if (canton["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (canton["codigo"] == "418") {
      openDialog(canton["mensaje"], "advertencia", this.dialog);
    } else if (canton["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  async actualizarCanton() {
    var respuesta = await this.panelAdministracionService.actualizarCanton(
      this.myForm.get("_idProvincia").value,
      this.myForm.get("_idCanton").value,
      this.myForm.get("_canton").value
    );
    if (respuesta["codigo"] == "200") {
      var cantones: any = this.cantones.data;
      var canton = cantones.filter(
        (canton) => canton["IdCanton"] == this.myForm.get("_idCanton").value
      );
      var index = cantones.indexOf(canton[0]);
      cantones.splice(index, 1);
      cantones.push({
        IdProvincia: respuesta["respuesta"].Provincia.IdProvincia,
        Provincia: respuesta["respuesta"].Provincia.Descripcion,
        IdCanton: respuesta["respuesta"].IdCanton,
        Descripcion: respuesta["respuesta"].Descripcion,
        PermitirEliminacion: respuesta["respuesta"].PermitirEliminacion,
      });
      this.cantones.data = cantones;
      this.myForm.reset();
      this.botonIngresar = "ingresar";
      this.panelAdministracionService.refresh$.emit();
      openSnackBar("Se actualizó correctamente", this.snackBar);
    } else if (respuesta["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (respuesta["codigo"] == "418") {
      openDialog(respuesta["mensaje"], "advertencia", this.dialog);
    } else if (respuesta["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  async eliminarCanton(idCanton) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.panelAdministracionService.eliminarCanton(
          idCanton
        );
        if (respuesta["codigo"] == "200") {
          var cantones = this.cantones.data;
          var canton = cantones.filter(
            (canton) => canton["IdCanton"] == idCanton
          );
          var index = cantones.indexOf(canton[0]);
          cantones.splice(index, 1);
          this.cantones.data = cantones;
          this.panelAdministracionService.refresh$.emit();
          openSnackBar("Se eliminó correctamente", this.snackBar);
        } else if (respuesta["codigo"] == "400") {
          openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "500") {
          openDialog("Problemas con el servidor", "advertencia", this.dialog);
        }
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
    this.myForm.get("_idProvincia").setValue(canton.IdProvincia);
    this.myForm.get("_provincia").setValue(canton.Provincia);
    this.botonIngresar = "modificar";
  }

  ngOnInit() {
    this.consultarCantones();
    this.panelAdministracionService.refresh$.subscribe(() => {
      this.consultarCantones();
    });
  }

  tablaCantones = ["canton", "provincia", "acciones"];
}
