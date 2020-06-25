import { Component, OnInit, ViewChild } from "@angular/core";
import { RubrosService } from "src/app/services/rubros.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { ModalPersonaComponent } from "../modal-persona/modal-persona.component";
import { MatDialog, MatTableDataSource, MatPaginator } from "@angular/material";

@Component({
  selector: "app-compra-rubros",
  templateUrl: "./compra-rubros.component.html",
  styleUrls: ["./compra-rubros.component.css"],
})
export class CompraRubrosComponent implements OnInit {
  myForm: FormGroup;
  constructor(private rubrosService: RubrosService, private dialog: MatDialog) {
    this.myForm = new FormGroup({
      _idRubro: new FormControl(""),
      _rubro: new FormControl(""),
      _idPresentacionRubro: new FormControl(""),
      _presentacionRubro: new FormControl(""),
      _identificadorPresentacion: new FormControl(""),
      _placaVehiculo: new FormControl(""),
      _cliente: new FormControl(""),
      _idCliente: new FormControl(""),
      _pesoBruto: new FormControl(""),
    });
  }

  rubros: any[] = [];
  presentacionRubros: any[] = [];
  placas: any[] = [];
  filteredOptions: Observable<string[]>;
  placasSeleccionables: any[] = [];
  carro = false;
  loading = true;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  tickets = new MatTableDataSource<Element[]>();

  async consultarRubros() {
    var respuesta = await this.rubrosService.consultarRubros();
    if (respuesta["codigo"] == "200") {
      this.rubros = respuesta["respuesta"];
    }
  }

  async consultarPresentacionRubros() {
    var respuesta = await this.rubrosService.consultarPresentacionRubros();
    if (respuesta["codigo"] == "200") {
      this.presentacionRubros = respuesta["respuesta"];
    }
  }

  async consultarTickets() {
    var respuesta = await this.rubrosService.consultarTickets();
    console.log(respuesta);
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      this.tickets.data = respuesta["respuesta"];
      this.tickets.paginator = this.paginator;
    }
  }

  // Codigo: "AMUCOMT 0001"
  // Estado: true
  // FechaIngreso: "2020-06-23T21:33:00"
  // PesoBruto: 10

  // _TipoPresentacionRubro:
  // Descripcion: "CARRO"

  // _TipoRubro:
  // Descripcion: "MAIZ"

  // _Vehiculo:
  // Placa: "geh944"

  async consultarPlacas() {
    var respuesta = await this.rubrosService.consultarPlacas();
    if (respuesta["codigo"] == "200") {
      this.placas = respuesta["respuesta"];
      this.placasSeleccionables = this.placas;
      this.filteredOptions = this.myForm
        .get("_placaVehiculo")
        .valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value))
        );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.placasSeleccionables.filter((option) =>
      option.Placa.toLowerCase().includes(filterValue)
    );
  }

  seleccionarPlacaVehiculo(placaVehiculo) {
    console.log(placaVehiculo);
  }

  seleccionarPersona() {
    let dialogRef = this.dialog.open(ModalPersonaComponent, {
      width: "auto",
      height: "auto",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_idCliente").setValue(result.idPersona);
        var nombres = result.nombres + " " + result.apellidos;
        this.myForm.get("_cliente").setValue(nombres);
      }
    });
  }

  selecionarRubro(rubro) {
    this.myForm.get("_idRubro").setValue(rubro.value);
  }

  seleccionarPresentacionRubros(presentacionRubro) {
    this.myForm.get("_idPresentacionRubro").setValue(presentacionRubro.value);
    var respuesta = this.presentacionRubros.find(
      (item) => item.IdTipoPresentacionRubro == presentacionRubro.value
    );
    console.log(respuesta);

    respuesta.Descripcion == "CARRO"
      ? (this.carro = true)
      : (this.carro = false);

    this.myForm
      .get("_identificadorPresentacion")
      .setValue(respuesta.Identificador);
  }

  async crearTicket() {
    var respuesta = await this.rubrosService.crearTicket(
      this.myForm.get("_idPresentacionRubro").value,
      this.myForm.get("_identificadorPresentacion").value,
      this.myForm.get("_idRubro").value,
      this.myForm.get("_placaVehiculo").value,
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      this.myForm.get("_pesoBruto").value,
      this.myForm.get("_idCliente").value
    );
    console.log(respuesta);
    if (respuesta["codigo"] == "200") {
      this.consultarPlacas();
      this.consultarTickets();
      this.myForm.reset();
    }
  }

  async eliminarTicket(idTicket) {
    console.log(idTicket);
    var respuesta = await this.rubrosService.eliminarTicket(idTicket);
    console.log(respuesta);
    if (respuesta["codigo"] == "200") {
      this.consultarPlacas();
      this.consultarTickets();
    }
  }

  ngOnInit() {
    this.consultarRubros();
    this.consultarPresentacionRubros();
    this.consultarPlacas();
    this.consultarTickets();
  }

  tablaTickets = [
    "codigo",
    "rubro",
    "presentacion",
    "placa",
    "pesoBruto",
    "acciones",
  ];
}
