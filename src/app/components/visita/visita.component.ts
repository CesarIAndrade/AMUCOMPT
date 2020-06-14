import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import {
  MatTableDataSource,
  MatPaginator,
  MatBottomSheet,
} from "@angular/material";
import { ComunidadesBottomSheet } from "./comunidades-bottom-sheet.component";
import { Router } from "@angular/router";
import { SeguimientoService } from "src/app/services/seguimiento.service";

@Component({
  selector: "app-visita",
  templateUrl: "./visita.component.html",
  styleUrls: ["./visita.component.css"],
})
export class VisitaComponent implements OnInit {
  constructor(
    private seguimientoService: SeguimientoService,
    private bottomSheet: MatBottomSheet,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _provincia: new FormControl(""),
      _canton: new FormControl(""),
      _parroquia: new FormControl(""),
      _comunidad: new FormControl(""),
      _idTecnico: new FormControl(""),
    });
  }

  openBottomSheet(comunidades, idComunidad): void {
    if (comunidades) {
      var comunidadesDeUnaPersona: any = [];
      comunidades.map((comunidad) => {
        comunidadesDeUnaPersona.push({
          _id: comunidad.IdAsignarTecnicoPersonaComunidad,
          descripcion: comunidad.Comunidad.Descripcion,
          idTecnico: comunidad.IdAsignarTUTecnico,
          visitas: comunidad.NumeroVisita,
        });
      });
      const bottomSheetRef = this.bottomSheet.open(ComunidadesBottomSheet, {
        data: { comunidades: comunidadesDeUnaPersona },
      });
    } else {
      this.router.navigate(["/registrar-visita/", idComunidad]);
    }
  }

  myForm: FormGroup;
  tabla = true;
  combos = true;
  loading = true;
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  comunidades: any[] = [];

  opciones = [
    {
      _id: "1",
      descripcion: "Comunidades",
    },
    {
      _id: "2",
      descripcion: "Personas",
    },
  ];

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  clientes = new MatTableDataSource<Element[]>();

  selecionarOpcion(opcion) {
    this.clientes.data = [];
    this.tabla = false;
    if (opcion.value === "1") {
      this.loading = true;
      this.combos = false;
      this.clientes.data = [];
      this.myForm.get("_provincia").setValue("0");
      this.myForm.get("_canton").setValue("0");
      this.myForm.get("_parroquia").setValue("0");
      this.myForm.get("_comunidad").setValue("0");
      this.consultarClientesFiltrados();
    } else if (opcion.value === "2") {
      this.loading = true;
      this.combos = true;
      this.listarClientesTecnico();
    }
  }

  consultarCantonesDeUnaProvincia(idProvincia) {
    this.clientes.data = [];
    var provincia = this.provincias.find(
      (provincia) => provincia.IdProvincia == idProvincia
    );
    this.cantones = provincia.CantonPersonas;
    this.myForm.get("_canton").setValue("0");
    this.myForm.get("_parroquia").setValue("0");
    this.myForm.get("_comunidad").setValue("0");
  }

  consultarParroquiasDeUnCanton(idCanton) {
    this.clientes.data = [];
    var canton = this.cantones.find((canton) => canton.IdCanton == idCanton);
    this.parroquias = canton.ParroquiaPersonas;
    this.myForm.get("_parroquia").setValue("0");
    this.myForm.get("_comunidad").setValue("0");
  }

  consultarComunidadesDeUnaParroquia(idParroquia) {
    this.clientes.data = [];
    var parroquia = this.parroquias.find(
      (parroquia) => parroquia.IdParroquia == idParroquia
    );
    this.comunidades = parroquia.ComunidadesPersonas;
    this.myForm.get("_comunidad").setValue("0");
  }

  mostrarClientesPorComunidad(idComunidad) {
    this.clientes.data = [];
    var comunidad = this.comunidades.find(
      (comunidad) => comunidad.IdComunidad == idComunidad
    );
    var data: any = [];
    comunidad.PersonaEntidad.map((cliente) => {
      data.push({
        _id: cliente.Persona.IdPersona,
        idComunidad: cliente.IdAsignarTecnicoPersonaComunidad,
        cedula: cliente.Persona.NumeroDocumento,
        nombres:
          cliente.Persona.PrimerNombre +
          " " +
          cliente.Persona.SegundoNombre +
          " " +
          cliente.Persona.ApellidoPaterno +
          " " +
          cliente.Persona.ApellidoMaterno,
        vivienda:
          cliente.Persona.AsignacionPersonaParroquia[0].Parroquia.Descripcion,
        telefono1: cliente.Persona.ListaTelefono[0].Numero,
        telefono2: cliente.Persona.ListaTelefono[1].Numero,
        terminarAsistencia: true,
      });
    });
    this.clientes.data = data;
    this.clientes.paginator = this.paginator;
  }

  async consultarClientesFiltrados() {
    var clientes = await this.seguimientoService.filtroClientesEnVisitas(
      this.myForm.get("_idTecnico").value
    );
    if (clientes["codigo"] == "200") {
      this.loading = false;
      this.clientes.data = [];
      this.provincias = clientes["respuesta"];
    }
  }

  async listarClientesTecnico() {
    var respuesta = await this.seguimientoService.listarClientesTecnico(
      "Credito/ConsultarPersonasConComunidadesPorTecnico",
      "IdAsignarTUTecnico",
      this.myForm.get("_idTecnico").value
    );
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var clientes = [];
      this.clientes.data = [];
      respuesta["respuesta"].map((cliente) => {
        clientes.push({
          _id: cliente.IdPersona,
          cedula: cliente.NumeroDocumento,
          nombres:
            cliente.PrimerNombre +
            " " +
            cliente.SegundoNombre +
            " " +
            cliente.ApellidoPaterno +
            " " +
            cliente.ApellidoMaterno,
          vivienda: cliente.AsignacionPersonaParroquia[0].Parroquia.Descripcion,
          telefono1: cliente.ListaTelefono[0].Numero,
          telefono2: cliente.ListaTelefono[1].Numero,
          comunidades: cliente._AsignarTecnicoPersonaComunidad
        });
      });
      this.clientes.data = clientes;
      this.clientes.paginator = this.paginator;
    }
  }

  async terminarAsistencia(idComunidad) {
    var respuesta = await this.seguimientoService.terminarAsistencia(
      idComunidad
    );
    console.log(respuesta);
    if(respuesta["codigo"] == "200") {
      var clientes = this.clientes.data;
      var cliente = clientes.find(cliente => cliente["idComunidad"] == idComunidad);
      var index = this.clientes.data.indexOf(cliente);
      clientes.splice(index, 1);
      this.clientes.data = clientes;
    }
  }

  ngOnInit() {
    this.myForm
      .get("_idTecnico")
      .setValue(localStorage.getItem("miCuenta.idAsignacionTipoUsuario"));
  }

  tablaClientes = ["cedula", "cliente", "vivienda", "telefonos", "acciones"];
}
