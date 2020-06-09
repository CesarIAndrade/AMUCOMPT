import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { PersonaService } from "src/app/services/persona.service";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "app-modal-asignacion-usuario-persona",
  templateUrl: "./modal-asignacion-usuario-persona.component.html",
  styleUrls: ["./modal-asignacion-usuario-persona.component.css"],
})
export class ModalAsignacionUsuarioPersonaComponent implements OnInit {
  constructor(
    private personaService: PersonaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  personas = new MatTableDataSource<Element[]>();

  filterPersona = "";
  datosPersona = {
    cedula: "",
    idPersona: "",
    nombres: "",
    apellidos: "",
  };

  asignarUsuarioaPersona(persona) {
    this.datosPersona.cedula = persona.NumeroDocumento;
    this.datosPersona.idPersona = persona.IdPersona;
    this.datosPersona.nombres =
      persona.PrimerNombre + " " + persona.SegundoNombre;
    this.datosPersona.apellidos =
      persona.ApellidoPaterno + " " + persona.ApellidoMaterno;
  }

  async consultarPersonas() {
    var personas = await this.personaService.consultarPersonasSinUsuario();
    if (personas["codigo"] == "200") {
      this.personas.data = personas["respuesta"];
      this.personas.paginator = this.paginator;
    }
  }

  async consultarPersonasTodas() {
    var personas = await this.personaService.consultarPersonas();
    if (personas["codigo"] == "200") {
      this.personas.data = personas["respuesta"];
      this.personas.paginator = this.paginator;
    }
  }

  ngOnInit() {
    if (this.data == "todos") {
      this.consultarPersonasTodas();
    } else {
      this.consultarPersonas();
    }
  }

  tablaPersonas = [
    "nombres",
    "apellidos",
    "documento",
    "numeroDocumento",
    "acciones",
  ];
}
