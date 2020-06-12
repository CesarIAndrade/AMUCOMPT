import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { SeguimientoService } from "src/app/services/seguimiento.service";
import { MatTableDataSource, MatPaginator } from "@angular/material";

@Component({
  selector: "app-creditos-abonos",
  templateUrl: "./creditos-abonos.component.html",
  styleUrls: ["./creditos-abonos.component.css"],
})
export class CreditosAbonosComponent implements OnInit {
  myForm: FormGroup;
  constructor(private seguimientoService: SeguimientoService) {
    this.myForm = new FormGroup({
      _cliente: new FormControl(""),
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
    if (respuesta["codigo"] == "200") {
      var facturas: any = [];
      respuesta["respuesta"].map((factura) => {
        var p = 100;
        var fechaActual = new Date("2020-07-08T00:00:00.00");
        var fechaFactura = new Date(factura.FechaGeneracion);
        var fechaFinalCredito = new Date(
          factura.ConfigurarVenta.FechaFinalCredito
        );
        var p100 =
          fechaFinalCredito.getTime() - fechaFactura.getTime();
        var px =
        fechaActual.getTime() - fechaFactura.getTime();
        var Difference_In_Days1 = p100 / (1000 * 3600 * 24);
        var Difference_In_Days2 = px / (1000 * 3600 * 24);
        var intervalo = (Difference_In_Days2 * p)/Difference_In_Days1;
        var estado: string;
        var filtroEstado: string;
        if (Math.round(intervalo) <= 50) {
          estado = "badge badge-success";
          filtroEstado = "0";
        } else if (Math.round(intervalo) > 50 && Math.round(intervalo) <= 80) {
          estado = "badge badge-warning";
          filtroEstado = "1";
        } else if (Math.round(intervalo) > 80) {
          estado = "badge badge-danger";
          filtroEstado = "2";
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
          TotalFactura: factura.Total,
          FechaFinalCredito: factura.ConfigurarVenta.FechaFinalCredito,
          Estado: estado,
          FiltroEstado: filtroEstado
        });
      });
      this.facturas.data = facturas;
      this.facturas.paginator = this.paginator;
    }
  }

  ngOnInit() {}

  tablaFacturasCliente = [
    "factura",
    "fecha",
    "cliente",
    "totalFactura",
    "fechaFinalCredito",
    "acciones",
    "estado",
  ];
}
