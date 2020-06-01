import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { UsuarioService } from "src/app/services/usuario.service";
import { VentaService } from "src/app/services/venta.service";
import { MatPaginator, MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-asignar-tecnico-cliente",
  templateUrl: "./asignar-tecnico-cliente.component.html",
  styleUrls: ["./asignar-tecnico-cliente.component.css"],
})
export class AsignarTecnicoClienteComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private usuarioService: UsuarioService,
    private ventaService: VentaService
  ) {
    this.myForm = new FormGroup({
      _canton: new FormControl(""),
      _parroquia: new FormControl(""),
      _comunidad: new FormControl(""),
      _idTecnico: new FormControl(""),
    });
  }

  myForm: FormGroup;
  canton = false;
  parroquia = false;
  comunidad = false;
  cantones: any[] = [];
  parroquias: any[] = [];
  comunidades: any[] = [];
  tecnicos: any[] = [];

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  clientes = new MatTableDataSource<Element[]>();
  clientesTecnico = new MatTableDataSource<Element[]>();

  consultarCantones() {
    this.panelAdministracionService
      .consultarCantones()
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
      .consultarParroquiasDeUnCanton(idCanton)
      .then((ok) => {
        this.parroquias = [];
        this.parroquias = ok["respuesta"];
        this.myForm.get("_comunidad").setValue("0");
        this.consultarClientesFiltrados(idCanton, "IdCanton", url);
        this.canton = true;
      })
      .catch((error) => console.log(error));
  }

  consultarComunidadesDeUnaParroquia(idParroquia) {
    const url =
      "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorParroquia";
    this.panelAdministracionService
      .consultarComunidadesDeUnaParroquia(idParroquia)
      .then((ok) => {
        this.comunidades = [];
        this.comunidades = ok["respuesta"];
        this.consultarClientesFiltrados(idParroquia, "IdParroquia", url);
        this.parroquia = true;
      })
      .catch((error) => console.log(error));
  }

  consultarClientesDeUnaComunidad(idComunidad) {
    const url = "Credito/ConsultarPersonasParaSeguimientoPorComunidad";
    this.consultarClientesFiltrados(idComunidad, "IdComunidad", url);
    this.comunidad = true;
  }

  async consultarClientesFiltrados(idLocalidad, localidad, url) {
    var clientes = await this.ventaService.filtroClientesEnAsignacion(
      url,
      idLocalidad,
      localidad
    );
    if (clientes["codigo"] == "200") {
      var data: any = [];
      clientes["respuesta"].map((cliente) => {
        data.push({
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
      this.clientes.data = data;
      this.clientes.paginator = this.paginator;
    }
  }

  consultarTecnicos() {
    this.usuarioService
      .consultarTecnicos("2")
      .then((ok) => {
        this.tecnicos = [];
        ok["respuesta"].map((tecnico) => {
          this.tecnicos.push({
            _id: tecnico.AsignacionTipoUsuario.IdAsignacionTUEncriptada,
            nombres:
              tecnico.PrimerNombre +
              " " +
              tecnico.SegundoNombre +
              " " +
              tecnico.ApellidoPaterno +
              " " +
              tecnico.ApellidoMaterno,
          });
        });
      })
      .catch((error) => console.log(error));
  }

  clientesAsignados(idTecnico) {
    const url = "Credito/ConsultarPersonasPorTecnico";
    this.myForm.get("_idTecnico").setValue(idTecnico);
    this.ventaService
      .listarClientesTecnico(
        url,
        "IdAsignarTUTecnico",
        idTecnico
      )
      .then((ok) => {
        var clientesTecnico = [];
        this.clientesTecnico.data = [];
        ok["respuesta"].map((cliente) => {
          clientesTecnico.push({
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
        this.clientesTecnico.data = clientesTecnico;
        this.clientesTecnico.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  asignarClienteTecnico(idPersona) {
    if (this.myForm.get("_idTecnico").value != "") {
      this.ventaService
        .asignarClienteTecnico(
          this.myForm.get("_idTecnico").value,
          idPersona
        )
        .then((ok) => {
          if (ok["respuesta"]) {
            var clientes = this.clientes.data;
            var cliente: any = clientes.filter(
              (cliente) => cliente["_id"] == idPersona
            );
            const index = clientes.indexOf(cliente[0]);
            clientes.splice(index, 1);
            this.clientes.data = clientes;
            this.clientesAsignados(this.myForm.get("_idTecnico").value);
          }
        })
        .catch((error) => console.log(error));
    } else {
      sweetAlert("Necesitas un técnnico", { icon: "warning" });
    }
  }

  queConsulto() {
    var url: string;
    if (this.canton && this.parroquia && this.comunidad) {
      url = "Credito/ConsultarPersonasParaSeguimientoPorComunidad";
      this.consultarClientesFiltrados(
        this.myForm.get("_comunidad").value,
        "IdComunidad",
        url
      );
    } else if (this.canton && this.parroquia) {
      url = "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorParroquia";
      this.consultarClientesFiltrados(
        this.myForm.get("_parroquia").value,
        "IdParroquia",
        url
      );
    } else if (this.canton) {
      url = "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorCanton";
      this.consultarClientesFiltrados(
        this.myForm.get("_canton").value,
        "IdCanton",
        url
      );
    }
  }

  desasignarClienteTecnico(persona) {
    this.ventaService
      .desaignarClienteTecnico(
        persona._id
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          this.clientesAsignados(this.myForm.get("_idTecnico").value);
          this.queConsulto();
        }
      })
      .catch((error) => console.log(error));
  }

  ngOnInit() {
    this.consultarCantones();
    this.consultarTecnicos();
  }

  tablaClientes = ["cedula", "cliente", "acciones"];
}
