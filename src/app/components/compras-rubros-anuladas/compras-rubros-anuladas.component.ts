import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { RubrosService } from "src/app/services/rubros.service";

@Component({
  selector: "app-compras-rubros-anuladas",
  templateUrl: "./compras-rubros-anuladas.component.html",
  styleUrls: ["./compras-rubros-anuladas.component.css"],
})
export class ComprasRubrosAnuladasComponent implements OnInit {
  constructor(private rubrosService: RubrosService) {}

  loading = true;
  transaccion = "Compra";

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  rubrosAnuladas = new MatTableDataSource<Element[]>();

  opciones = [
    {
      _id: "1",
      descripcion: "Compras Anuladas",
      checked: true,
    },
    {
      _id: "2",
      descripcion: "Ventas Anuladas",
      checked: false,
    },
  ];

  selecionarOpcion(opcion) {
    this.rubrosAnuladas.data = [];
    if (opcion._id === "1") {
      this.transaccion = "Compra";
      this.consultarRubrosAnulados("ConsultarTicketAnulados", opcion._id);
    } else if (opcion._id === "2") {
      this.transaccion = "Venta";
      this.consultarRubrosAnulados("ConsultarTicketVentaAnulados", opcion._id)
    }
  }

  async consultarRubrosAnulados(url, opcion) {
    this.loading = true;
    var respuesta = await this.rubrosService.consultarRubrosAnulados(url);
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var temp_respuesta: any = [];
      respuesta["respuesta"].map((item) => {
        temp_respuesta.push({
          Codigo: item.Codigo,
          FechaIngreso: item.FechaIngreso,
          Nombres:
            item._PersonaQueDaAnular.PrimerNombre +
            " " +
            item._PersonaQueDaAnular.ApellidoPaterno,
          Presentacion: item._TipoPresentacionRubro.Descripcion,
          Rubro: item._TipoRubro.Descripcion,
          PesoNeto: item.PesoNeto,
          Total: opcion == "1" ? item.TotalAPagar : item.TotalACobrar
        });
      });
      this.rubrosAnuladas.data = temp_respuesta;
      this.rubrosAnuladas.paginator = this.paginator;
    }
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.rubrosAnuladas.filter = term;
  }

  ngOnInit() {
    this.consultarRubrosAnulados("ConsultarTicketAnulados", "1");
  }

  tablaComprasRubrosAnuladas = [
    "codigo",
    "fecha",
    "encargado",
    "rubro",
    "presentacion",
    "pesoNeto",
    "total",
  ];
}
