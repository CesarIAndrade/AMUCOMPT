import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { salir, openDialog } from "../../functions/global";
import { Router } from "@angular/router";

// Components
import { ModalDetallePersonaComponent } from "../modal-detalle-persona/modal-detalle-persona.component";

// Material
import { MatTableDataSource, MatPaginator, MatDialog } from "@angular/material";

// Services
import { PersonaService } from "src/app/services/persona.service";

@Component({
  selector: "app-tabla-persona",
  templateUrl: "./tabla-persona.component.html",
  styleUrls: ["./tabla-persona.component.css"],
})
export class TablaPersonaComponent implements OnInit {
  constructor(
    private personaService: PersonaService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  @Input() llamadaModal = "false";
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  personas = new MatTableDataSource<Element[]>();

  async consultarPersonas() {
    var respuesta = await this.personaService.consultarPersonas();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var personas: any = [];
      respuesta["respuesta"].map((persona) => {
        persona.Acciones = this.llamadaModal;
        personas.push(persona);
      });
      this.personas.data = personas;
      this.personas.paginator = this.paginator;
    } else if (respuesta["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir());
    }
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.personas.filter = term;
  }

  @Output() obtenerPersona = new EventEmitter();
  seleccionarPersona(persona) {
    this.obtenerPersona.emit(persona);
  }

  abrirModal(persona) {
    this.dialog.open(ModalDetallePersonaComponent, {
      width: "auto",
      height: "auto",
      data: {
        persona: persona,
      },
    });
  }

  @Output() enviarPersona = new EventEmitter();
  mostrarPersona(persona) {
    this.enviarPersona.emit(persona);
  }

  ngOnInit() {
    this.consultarPersonas();
    this.personaService.refresh$.subscribe(() => {
      this.consultarPersonas();
    });
  }

  tablaPersonas = [
    "nombres",
    "apellidos",
    "documento",
    "numeroDocumento",
    "acciones",
  ];
}
