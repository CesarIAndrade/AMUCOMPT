import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { Router } from '@angular/router';
import { salir, openDialog } from '../../functions/global';

// Components
import { RealizarAbonoComponent } from "../realizar-abono/realizar-abono.component";

// Material
import { MatTableDataSource, MatPaginator, MatDialog } from "@angular/material";

// Services
import { SeguimientoService } from "src/app/services/seguimiento.service";
import { PersonaService } from "src/app/services/persona.service";

@Component({
  selector: "app-creditos-abonos",
  templateUrl: "./creditos-abonos.component.html",
  styleUrls: ["./creditos-abonos.component.css"],
})
export class CreditosAbonosComponent implements OnInit {
  myForm: FormGroup;
  constructor(
    private seguimientoService: SeguimientoService,
    private modalRealizarAbono: MatDialog,
    private personaService: PersonaService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.myForm = new FormGroup({
      _cliente: new FormControl(""),
      _numeroDocumento: new FormControl(""),
    });
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  facturas = new MatTableDataSource<Element[]>();
  personas = new MatTableDataSource<Element[]>();

  filteredOptions: Observable<string[]>;
  _personas: any[] = [];
  loading = false;

  async consultarPersonas() {
    var respuesta = await this.personaService.consultarPersonas();
    if (respuesta["codigo"] == "200") {
      this.personas.data = respuesta["respuesta"];
      this._personas = respuesta["respuesta"];
      this.filteredOptions = this.myForm.get("_cliente").valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
    } else if (respuesta["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir())
    }
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase().trim();
      return this._personas.filter((option) =>
        (
          option.PrimerNombre +
          option.SegundoNombre +
          option.ApellidoPaterno +
          option.ApellidoMaterno +
          option.NumeroDocumento
        )
          .trim()
          .toLowerCase()
          .includes(filterValue)
      );
    } else {
      return this._personas;
    }
  }

  limpiarCampo() {
    this.myForm.get("_cliente").reset();
    this.facturas.data = [];
  }

  async seleccionarCliente(numeroDocumento) {
    this.myForm.get("_numeroDocumento").setValue(numeroDocumento);
    this.loading = true;
    this.facturas.data = [];
    var respuesta = await this.seguimientoService.consultarFacturasCliente(
      numeroDocumento
    );
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var facturas: any = [];
      respuesta["respuesta"].map((factura) => {
        var p = 100;
        var fechaActual = new Date("2020-06-25T00:00:00");
        // 2020-06-T09:08:30.79
        var fechaFactura = new Date(factura.FechaGeneracion);
        var fechaFinalCredito = new Date(
          factura.ConfigurarVenta.FechaFinalCredito
        );
        var p100 = fechaFinalCredito.getTime() - fechaFactura.getTime();
        var px = fechaActual.getTime() - fechaFactura.getTime();
        var mora = fechaFinalCredito.getTime() - fechaActual.getTime();
        var Difference_In_Days1 = p100 / (1000 * 3600 * 24);
        var Difference_In_Days2 = px / (1000 * 3600 * 24);
        var intervalo = (Difference_In_Days2 * p) / Difference_In_Days1;
        var estado: string;
        var filtroEstado: string;
        if (factura.ConfigurarVenta.EstadoConfVenta == 1) {
          estado = "badge badge-secondary";
          filtroEstado = "Finalizado";
        } else {
          if (mora < 0) {
            estado = "badge badge-danger";
            filtroEstado = "Mora";
          } else {
            if (Math.round(intervalo) <= 50) {
              estado = "badge badge-success";
              filtroEstado = "Normal";
            } else if (Math.round(intervalo) > 50) {
              estado = "badge badge-warning";
              filtroEstado = "Urgente";
            }
          }
        }
        facturas.push({
          Codigo: factura.Codigo,
          Fecha: factura.FechaGeneracion,
          TotalFactura: factura.ConfigurarVenta._SaldoPendiente.TotalFactura,
          Pendiente: factura.ConfigurarVenta._SaldoPendiente.Pendiente,
          Mora: factura.ConfigurarVenta._SaldoPendiente.TotalInteres,
          FechaFinalCredito: factura.ConfigurarVenta.FechaFinalCredito,
          Estado: estado,
          FiltroEstado: filtroEstado,
          idConfigurarVenta: factura.ConfigurarVenta.IdConfigurarVenta,
          estadoConfVenta: factura.ConfigurarVenta.EstadoConfVenta,
        });
      });
      this.facturas.data = facturas;
      this.facturas.paginator = this.paginator;
    }
  }

  searchCliente(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.personas.filter = term;
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.facturas.filter = term;
  }

  realizarAbono(factura) {
    this.modalRealizarAbono.open(RealizarAbonoComponent, {
      width: "auto",
      height: "auto",
      data: {
        idConfigurarVenta: factura.idConfigurarVenta,
        flag: factura.estadoConfVenta == "1" ? false : true,
      },
    });
  }

  ngOnInit() {
    this.consultarPersonas();
    this.seguimientoService.refresh$.subscribe(() => {
      this.seleccionarCliente(this.myForm.get("_numeroDocumento").value);
    });
  }

  tablaFacturasCliente = [
    "factura",
    "fecha",
    "totalFactura",
    "saldoPendiente",
    "saldoMora",
    "fechaFinalCredito",
    "acciones",
    "estado",
  ];
}
