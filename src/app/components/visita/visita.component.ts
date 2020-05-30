import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatTableDataSource, MatPaginator, MatBottomSheetRef, MatBottomSheet } from "@angular/material";
import { VentaService } from "src/app/services/venta.service";
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { ComunidadesBottomSheet } from './comunidades-bottom-sheet.component';

@Component({
  selector: "app-visita",
  templateUrl: "./visita.component.html",
  styleUrls: ["./visita.component.css"],
})
export class VisitaComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private ventaService: VentaService,
    private bottomSheet: MatBottomSheet
  ) {
    this.myForm = new FormGroup({
      _canton: new FormControl(""),
      _parroquia: new FormControl(""),
      _comunidad: new FormControl(""),
    });
  }

  openBottomSheet(comunidades): void {
    var comunidadesDeUnaPersona: any[] = [];
    comunidades.map(comunidad => {
      comunidadesDeUnaPersona.push({
        _id: comunidad.IdAsignarTecnicoPersonaComunidad,
        descripcion: comunidad.Comunidad.Descripcion,
        idTecnico: comunidad.IdAsignarTUTecnico
      })
    })
    const bottomSheetRef = this.bottomSheet.open(ComunidadesBottomSheet, {
      data: { comunidades: comunidadesDeUnaPersona },
    });
    
  }

  myForm: FormGroup;
  tabla = true;
  combos = true;
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
    this.tabla = false;
    if (opcion.value === "1") {
      this.combos = false;
      this.consultarCantones();
    } else if (opcion.value === "2") {
      this.combos = true;
      this.listarClientesTecnico();
    }
  }

  consultarCantones() {
    this.panelAdministracionService
      .consultarCantones(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.cantones = [];
        this.cantones = ok["respuesta"];
        this.myForm.get("_parroquia").setValue("0");
        this.myForm.get("_comunidad").setValue("0");
      })
      .catch((error) => console.log(error));
  }

  consultarParroquiasDeUnCanton(idCanton) {
    const url = "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorCanton";
    this.panelAdministracionService
      .consultarParroquiasDeUnCanton(
        idCanton,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.parroquias = [];
        this.parroquias = ok["respuesta"];
        this.myForm.get("_comunidad").setValue("0");
        this.consultarClientesFiltrados(idCanton, "IdCanton", url);
      })
      .catch((error) => console.log(error));
  }

  consultarComunidadesDeUnaParroquia(idParroquia) {
    const url =
      "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorParroquia";
    this.panelAdministracionService
      .consultarComunidadesDeUnaParroquia(
        idParroquia,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.comunidades = [];
        this.comunidades = ok["respuesta"];
        this.consultarClientesFiltrados(idParroquia, "IdParroquia", url);
      })
      .catch((error) => console.log(error));
  }

  consultarClientesDeUnaComunidad(idComunidad) {
    const url = "Credito/ConsultarPersonasParaSeguimientoPorComunidad";
    this.consultarClientesFiltrados(idComunidad, "IdComunidad", url);
  }

  consultarClientesFiltrados(idLocalidad, localidad, url) {
    this.ventaService
      .filtroClientes(
        url,
        idLocalidad,
        localidad,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        var clientes = [];
        this.clientes.data = [];
        ok["respuesta"].map((cliente) => {
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
          });
        });
        this.clientes.data = clientes;
        this.clientes.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  listarClientesTecnico() {
    const url = "Credito/ConsultarPersonasConComunidadesPorTecnico"
    this.ventaService.listarClientesTecnico(
      url,
      "IdAsignarTUTecnico",
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      localStorage.getItem("miCuenta.getToken")
    ).then(ok => {
      var clientes = [];
      this.clientes.data = [];
      ok["respuesta"].map((cliente) => {
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
    }).catch(error => console.log(error))
  }

  registrarVisita(comunidad) {}

  ngOnInit() {}

  tablaClientes = ["cedula", "cliente", "vivienda", "telefonos","acciones"];
}
