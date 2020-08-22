import { Component, OnInit } from "@angular/core";
import { ModalConfigurarReporteComponent } from "../modal-configurar-reporte/modal-configurar-reporte.component";
import { MatDialog } from "@angular/material";
import { reportsUrl } from "../../../environments/environment";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
})
export class ReportesComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    var tipoUsuario: any = localStorage.getItem("miCuenta.tipoUsuario");
    if (tipoUsuario == 2) {
      this.reportes = [
        {
          id: "3",
          rol: "tecnico",
          descripcion: "Clientes",
          url: "reporte/Tecnicos",
          // ?Tecnico=
        },
      ];
    } else if (tipoUsuario == 3) {
      this.reportes = [
        {
          id: "1",
          rol: "secreteria",
          descripcion: "Situación Inventario",
          url: "reporte/Inversion",
          // ?Inicio=01-01-2020&Fin=12-10-2020
        },
        {
          id: "3",
          rol: "secreteria",
          descripcion: "Listado de facturas emitidas por rango de fecha",
          url: "reporte/FacturasEmitidas",
          // ?Inicio=06-01-2020&Fin=07-10-2020
        },
        {
          id: "4",
          rol: "secreteria",
          descripcion: "Listado de facturas canceladas por rango de fecha",
          url: "reporte/FacturasCanceladas",
          // ?Inicio=06-01-2020&Fin=07-10-2020
        },
        {
          id: "5",
          rol: "secreteria",
          descripcion: "Listado de facturas vencidas por rango de fecha",
          url: "reporte/FacturasVencidas",
          // ?Inicio=06-01-2020&Fin=07-10-2020
        },
        {
          id: "6",
          rol: "secreteria",
          descripcion: "Listado de facturas pendientes por rango de fecha",
          url: "reporte/FacturasPendientes",
          // ?Inicio=06-01-2020&Fin=07-10-2020
        },
        {
          id: "7",
          rol: "secreteria",
          descripcion: "Listado de facturas pendientes por cliente",
          url: "reporte/FacturasPendientes",
          // ?IdPersona=4151
        },
      ];
    } else if (tipoUsuario == 4) {
      this.reportes = [
        {
          id: "1",
          rol: "gerente",
          descripcion: "Situación Inventario",
          url: "reporte/Inversion",
          // ?Inicio=01-01-2020&Fin=12-10-2020
        },
        {
          id: "2",
          rol: "gerente",
          descripcion: "Situación Rubros",
          url: "reporte/ReporteQuintales",
          // ?Inicio=06-01-2020&Fin=07-10-2020
        },
        {
          id: "3",
          rol: "gerente",
          descripcion: "Situación Técnicos",
          url: "reporte/TecnicosInformacion",
          //
        },
      ];
    } else if (tipoUsuario == 5) {
      this.reportes = [
        {
          id: "1",
          rol: "administrador",
          descripcion: "Reporte general compra",
          url: "reporte/FacturaCompras",
          // ?Inicio=01-01-2020&Fin=07-10-2020
        },
        {
          id: "2",
          rol: "administrador",
          descripcion: "Reporte general venta",
          url: "reporte/reporteVenta",
          // ?Identificador=1&Inicio=07-01-2020&Fin=07-10-2020
        },
        {
          id: "3",
          rol: "administrador",
          descripcion: "Reporte individual por cliente venta",
          url: "Reporte/ReporteVenta",
          // ?Identificacion=0954308078&Inicio=07-01-2020&Fin=07-10-2020
        },
        {
          id: "4",
          rol: "administrador",
          descripcion: "Reporte en rango de fecha cuantos qq se ha comprado",
          url: "reporte/ReporteQuintales",
          // ?Inicio=06-01-2020&Fin=07-10-2020
        },
        {
          id: "5",
          rol: "administrador",
          descripcion:
            "Reporte en rango de fecha del promedio de precio de compra y venta realizado",
          url: "Reporte/Estadistica",
          // ?Inicio=07-01-2020&Fin=07-20-2020
        },
        {
          id: "6",
          rol: "administrador",
          descripcion:
            "Reporte en rango de fecha del promedio de humedad de compra y venta realizado",
          url: "Reporte/Humedad",
          // ?Inicio=07-01-2020&Fin=07-20-2020
        },
      ];
    }
  }

  reportes = [];

  irAlReporte(reporte) {
    if (reporte.rol == "tecnico") {
      var url = `${reporte.url}?Tecnico=${localStorage.getItem(
        "miCuenta.idAsignacionTipoUsuario"
      )}`;
      window.open(reportsUrl + url);
    } else if (reporte.rol == "gerente") {
      if(reporte.id == 3) {
        window.open(reportsUrl + reporte.url);
      } else {
        this.abrirModal(reporte);
      }
    } else {
      this.abrirModal(reporte);
    }
  }

  abrirModal(reporte) {
    this.dialog.open(ModalConfigurarReporteComponent, {
      width: "350px",
      height: "auto",
      data: {
        id: reporte.id,
        url: reporte.url,
        rol: reporte.rol,
      },
    });
  }

  seleccionarCliente() {}
}
