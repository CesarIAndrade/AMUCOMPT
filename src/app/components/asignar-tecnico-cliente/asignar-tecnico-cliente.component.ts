import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { UsuarioService } from "src/app/services/usuario.service";
import { VentaService } from "src/app/services/venta.service";
import { MatPaginator, MatTableDataSource, MatDialog } from "@angular/material";
import { SeguimientoService } from "src/app/services/seguimiento.service";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

@Component({
  selector: "app-asignar-tecnico-cliente",
  templateUrl: "./asignar-tecnico-cliente.component.html",
  styleUrls: ["./asignar-tecnico-cliente.component.css"],
})
export class AsignarTecnicoClienteComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private ventaService: VentaService,
    private seguimientoService: SeguimientoService,
    private dialog: MatDialog
  ) {
    this.myForm = new FormGroup({
      _provincia: new FormControl(""),
      _canton: new FormControl(""),
      _parroquia: new FormControl(""),
      _comunidad: new FormControl(""),
      _idTecnico: new FormControl(""),
    });
  }

  myForm: FormGroup;
  provincia = false;
  canton = false;
  parroquia = false;
  comunidad = false;
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  comunidades: any[] = [];
  tecnicos: any[] = [];

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  clientes = new MatTableDataSource<Element[]>();
  clientesTecnico = new MatTableDataSource<Element[]>();

  openDialog(mensaje): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje },
    });
  }

  async provinciasParaSeguimiento() {
    var respuesta = await this.seguimientoService.provinciasParaSeguimiento();
    if (respuesta["codigo"] == "200") {
      this.provincias = respuesta["respuesta"];
    }
  }

  async cantonesParaSeguimiento(idProvincia) {
    var respuesta = await this.seguimientoService.cantonesParaSeguimiento(
      idProvincia
    );
    console.log(idProvincia);
    
    this.myForm.get("_canton").setValue("0");
    this.myForm.get("_parroquia").setValue("0");
    this.myForm.get("_comunidad").setValue("0");
    if (respuesta["codigo"] == "200") {
      this.cantones = respuesta["respuesta"];
      this.consultarClientesFiltrados(
        idProvincia,
        "IdProvincia",
        "Credito/ConsultarPersonasParaSeguimientoPorProvincia"
      );
    }
  }

  async parroquiasParaSeguimiento(idCanton) {
    var respuesta = await this.seguimientoService.parroquiasParaSeguimiento(
      idCanton
    );
    this.myForm.get("_parroquia").setValue("0");
    this.myForm.get("_comunidad").setValue("0");
    if (respuesta["codigo"] == "200") {
      this.parroquias = respuesta["respuesta"];
      this.consultarClientesFiltrados(
        idCanton,
        "IdCanton",
        "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorCanton"
      );
    }
  }

  async comunidadesParaSeguimiento(idParroquia) {
    var respuesta = await this.seguimientoService.comunidadesParaSeguimiento(
      idParroquia
    );
    this.myForm.get("_comunidad").setValue("0");
    if (respuesta["codigo"] == "200") {
      this.comunidades = respuesta["respuesta"];
      this.consultarClientesFiltrados(
        idParroquia,
        "IdParroquia",
        "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorParroquia"
      );
    }
  }

  consultarClientesDeUnaComunidad(idComunidad) {
    this.consultarClientesFiltrados(
      idComunidad,
      "IdComunidad",
      "Credito/ConsultarPersonasParaSeguimientoPorComunidad"
    );
  }

  async consultarClientesFiltrados(idLocalidad, localidad, url) {
    var clientes = await this.ventaService.filtroClientesEnAsignacion(
      url,
      idLocalidad,
      localidad
    );
    console.log(clientes);
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

  async consultarTecnicos() {
    var respuesta = await this.usuarioService.consultarTecnicos("2");
    if (respuesta["codigo"] == "200") {
      respuesta["respuesta"].map((tecnico) => {
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
    }
  }

  async clientesAsignados(idTecnico) {
    this.myForm.get("_idTecnico").setValue(idTecnico);
    var respuesta = await this.ventaService.listarClientesTecnico(
      "Credito/ConsultarPersonasPorTecnico",
      "IdAsignarTUTecnico",
      idTecnico
    );
    if (respuesta["codigo"] == "200") {
      var clientesTecnico: any;
      this.clientesTecnico.data = [];
      respuesta["respuesta"].map((cliente) => {
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
    }
  }

  async asignarClienteTecnico(idPersona) {
    if (this.myForm.get("_idTecnico").value != "") {
      var respuesta = await this.ventaService.asignarClienteTecnico(
        this.myForm.get("_idTecnico").value,
        idPersona
      );
      if (respuesta["codigo"] == "200") {
        var clientes = this.clientes.data;
        var cliente: any = clientes.filter(
          (cliente) => cliente["_id"] == idPersona
        );
        const index = clientes.indexOf(cliente[0]);
        clientes.splice(index, 1);
        this.clientes.data = clientes;
        this.clientesAsignados(this.myForm.get("_idTecnico").value);
      }
    } else {
      this.openDialog("Necesitas un técnnico");
    }
  }

  queConsulto() {
    var url: string;
    if (this.provincia && this.canton && this.parroquia && this.comunidad) {
      this.consultarClientesFiltrados(
        this.myForm.get("_comunidad").value,
        "IdComunidad",
        "Credito/ConsultarPersonasParaSeguimientoPorComunidad"
      );
    } else if (this.provincia && this.canton && this.parroquia) {
      this.consultarClientesFiltrados(
        this.myForm.get("_parroquia").value,
        "IdParroquia",
        "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorParroquia"
      );
    } else if (this.provincia && this.canton) {
      this.consultarClientesFiltrados(
        this.myForm.get("_canton").value,
        "IdCanton",
        "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorCanton"
      );
    } else if (this.provincia) {
      this.consultarClientesFiltrados(
        this.myForm.get("_canton").value,
        "IdCanton",
        "Credito/ConsultarPersonasParaSeguimientoPorProvincia"
      );
    }
  }

  async desasignarClienteTecnico(persona) {
    var respuesta = await this.ventaService.desaignarClienteTecnico(
      persona._id
    );
    if (respuesta["codigo"] == "200") {
      this.clientesAsignados(this.myForm.get("_idTecnico").value);
      this.queConsulto();
    }
  }

  ngOnInit() {
    this.provinciasParaSeguimiento();
    this.consultarTecnicos();
  }

  tablaClientes = ["cedula", "cliente", "acciones"];
}
