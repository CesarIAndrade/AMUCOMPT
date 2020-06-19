import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

// Components
import { RealizarAbonoComponent } from "../realizar-abono/realizar-abono.component";

// Material
import { MatTableDataSource, MatPaginator, MatDialog } from "@angular/material";

// Services
import { SeguimientoService } from "src/app/services/seguimiento.service";

@Component({
  selector: "app-creditos-abonos",
  templateUrl: "./creditos-abonos.component.html",
  styleUrls: ["./creditos-abonos.component.css"],
})
export class CreditosAbonosComponent implements OnInit {
  myForm: FormGroup;
  constructor(
    private seguimientoService: SeguimientoService,
    private modalRealizarAbono: MatDialog
  ) {
    this.myForm = new FormGroup({
      _cliente: new FormControl("", [Validators.required]),
    });
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  facturas = new MatTableDataSource<Element[]>();

  validarFormulario() {
    if (this.myForm.valid) {
      this.consultarFacturasCliente();
    }
  }

  filterFacturas = "";
  async consultarFacturasCliente() {
    var respuesta = await this.seguimientoService.consultarFacturasCliente(
      this.myForm.get("_cliente").value
    );
    console.log(respuesta);
    if (respuesta["codigo"] == "200") {
      var facturas: any = [];
      respuesta["respuesta"].map((factura) => {
        var p = 100;
        var fechaActual = new Date(); 
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
              filtroEstado = "Observación";
            }
          }
        }

        facturas.push({
          Codigo: factura.Codigo,
          Fecha: factura.FechaGeneracion,
          Cliente:
            factura.ConfigurarVenta._PersonaEntidad.PrimerNombre +
            " " +
            factura.ConfigurarVenta._PersonaEntidad.SegundoNombre +
            " " +
            factura.ConfigurarVenta._PersonaEntidad.ApellidoPaterno +
            " " +
            factura.ConfigurarVenta._PersonaEntidad.ApellidoMaterno,
          TotalFactura: factura.ConfigurarVenta._SaldoPendiente.TotalFactura,
          Pendiente: factura.ConfigurarVenta._SaldoPendiente.Pendiente,
          FechaFinalCredito: factura.ConfigurarVenta.FechaFinalCredito,
          Estado: estado,
          FiltroEstado: filtroEstado,
          idConfigurarVenta: factura.ConfigurarVenta.IdConfigurarVenta,
          estadoConfVenta: factura.ConfigurarVenta.EstadoConfVenta
        });
      });
      this.facturas.data = facturas;
      this.facturas.paginator = this.paginator;
    }
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
        flag: factura.estadoConfVenta == "1"? false : true,
      },
    });
  }

  ngOnInit() {
    this.seguimientoService.refresh$.subscribe(() => {
      this.consultarFacturasCliente();
    });
  }

  tablaFacturasCliente = [
    "factura",
    "fecha",
    "cliente",
    "totalFactura",
    "saldoPendiente",
    "fechaFinalCredito",
    "acciones",
    "estado",
  ];
}
