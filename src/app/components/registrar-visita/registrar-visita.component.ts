import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  MatTableDataSource,
  MatPaginator,
  MatSnackBar,
} from "@angular/material";
import { SeguimientoService } from 'src/app/services/seguimiento.service';

@Component({
  selector: "app-registrar-visita",
  templateUrl: "./registrar-visita.component.html",
  styleUrls: ["./registrar-visita.component.css"],
})
export class RegistrarVisitaComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private seguimientoService: SeguimientoService,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _idVisita: new FormControl(""),
      _observacion: new FormControl("", [Validators.required]),
      _idComunidad: new FormControl(""),
      _idTecnico: new FormControl(""),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";

  async visitasClienteComunidad(idComunidad) {
    var respuesta = await this.seguimientoService.visitasClienteComunidad(
      idComunidad
    );
    if (respuesta["codigo"] == "200") {
      var visitas: any = [];
      respuesta["respuesta"].map((visita) => {
        visitas.push({
          _id: visita.IdVisita,
          idComunidad: visita.IdAsignarTecnicoPersonaComunidad,
          idTecnico: visita.IdAsignarTU,
          fecha: visita.FechaRegistro,
          observacion: visita.Observacion,
        });
      });
      this.visitas.data = visitas;
      this.visitas.paginator = this.paginator;
    }
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  visitas = new MatTableDataSource<Element[]>();

  openSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 2000,
      horizontalPosition: "right",
    });
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.registrarVisita();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarVisita();
      }
    }
  }

  async registrarVisita() {
    var visita = await this.seguimientoService.registrarVisita(
      this.myForm.get("_idComunidad").value,
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      this.myForm.get("_observacion").value
    );
    if (visita["codigo"] == "200") {
      var visitas: any = this.visitas.data;
      visitas.push({
        _id: visita["respuesta"].IdVisita,
        idComunidad: visita["respuesta"].IdAsignarTecnicoPersonaComunidad,
        idTecnico: visita["respuesta"].IdAsignarTU,
        observacion: visita["respuesta"].Observacion,
        fecha: visita["respuesta"].FechaRegistro,
      });
      this.visitas.data = visitas;
      this.visitas.paginator = this.paginator;
      this.myForm.reset();
      this.openSnackBar("Se guardó correctamente!");
    }
  }

  mostrarVisita(visita) {
    this.myForm.get("_idVisita").setValue(visita._id);
    this.myForm.get("_observacion").setValue(visita.observacion);
    this.myForm.get("_idComunidad").setValue(visita.idComunidad);
    this.myForm.get("_idTecnico").setValue(visita.idTecnico);
    this.botonIngresar = "modificar";
  }

  async actualizarVisita() {
    var respuesta = await this.seguimientoService.actualizarVisita(
      this.myForm.get("_idVisita").value,
      this.myForm.get("_idTecnico").value,
      this.myForm.get("_observacion").value
    );
    if (respuesta["codigo"] == "200") {
      var visitas: any = this.visitas.data;
      var visita = visitas.filter(
        (visita) => visita["_id"] == this.myForm.get("_idVisita").value
      );
      var index = visitas.indexOf(visita[0]);
      visitas.splice(index, 1);
      visitas.push({
        _id: respuesta["respuesta"].IdVisita,
        idComunidad: respuesta["respuesta"].IdAsignarTecnicoPersonaComunidad,
        idTecnico: respuesta["respuesta"].IdAsignarTU,
        observacion: respuesta["respuesta"].Observacion,
        fecha: respuesta["respuesta"].FechaRegistro,
      });
      this.visitas.data = visitas;
      this.botonIngresar = "ingresar";
      this.myForm.reset();
      this.openSnackBar("Se actualizó correctamente");
    }
  }

  async eliminarVisita(idVisita) {
    var respuesta = await this.seguimientoService.eliminarVisita(idVisita);
    if (respuesta["codigo"] == "200") {
      var visitas = this.visitas.data;
      var visita: any = visitas.filter((visita) => visita["_id"] == idVisita);
      var index = visitas.indexOf(visita[0]);
      visitas.splice(index, 1);
      this.visitas.data = visitas;
      this.openSnackBar("Se eliminó correctamente");
    }
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.visitasClienteComunidad(param.get("id"));
      this.myForm.get("_idComunidad").setValue(param.get("id"));
    });
  }

  tablaVisitas = ["observacion", "fecha", "acciones"];
}
