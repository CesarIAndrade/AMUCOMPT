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

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  comprasRubrosAnuladas = new MatTableDataSource<Element[]>();

  async consultarComprasRubrosAnuladas() {
    var respuesta = await this.rubrosService.consultarComprasRubrosAnuladas();
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
          TotalAPagar: item.TotalAPagar,
        });
      });
      this.comprasRubrosAnuladas.data = temp_respuesta;
      this.comprasRubrosAnuladas.paginator = this.paginator;
    }
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.comprasRubrosAnuladas.filter = term;
  }

  ngOnInit() {
    this.consultarComprasRubrosAnuladas();
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
