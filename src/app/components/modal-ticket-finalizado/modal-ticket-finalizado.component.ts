import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import * as jsPdf from "jspdf"
@Component({
  selector: "app-modal-ticket-finalizado",
  templateUrl: "./modal-ticket-finalizado.component.html",
  styleUrls: ["./modal-ticket-finalizado.component.css"],
})
export class ModalTicketFinalizadoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  detalleTicket: any = {}

  porSaco = true;
  medidaPesoNeto: string;

  imprimirComprobante(encabezado) {    
    const doc = new jsPdf();
    doc.fromHTML(document.getElementById("comprobante"),10,10);
    doc.save(encabezado);
  }

  ngOnInit() {
    if(this.data.ruta == "venta") {
      this.detalleTicket = {
        codigo: this.data.ticket.Codigo,
        entrada: this.data.ticket.FechaIngreso,
        salida: this.data.ticket.FechaSalida ? this.data.ticket.FechaSalida : this.data.ticket.FechaIngreso,
        peso: this.data.ticket.PesoACobrar,
        precioPorQuintal: this.data.ticket.PrecioPorQuintal,
        Total: this.data.ticket.TotalACobrar,
        pesoBruto: this.data.ticket.PesoBruto,
        pesoSinImpurezas: null,
        pesoNeto: this.data.ticket.PesoNeto,
        pesoTara: this.data.ticket.PesoTara,
        rubros: this.data.ticket._TipoRubro.Descripcion,
        presentacion: this.data.ticket._TipoPresentacionRubro.Descripcion,
        vehiculo: this.data.ticket._Vehiculo.Placa,
        porcentajeHumedad: this.data.ticket.PorcentajeHumedad,
        porcentajeImpureza: this.data.ticket.PorcentajeImpureza,
      }
    } else {
      this.detalleTicket = {
        codigo: this.data.ticket.Codigo,
        entrada: this.data.ticket.FechaIngreso,
        salida: this.data.ticket.FechaSalida ? this.data.ticket.FechaSalida : this.data.ticket.FechaIngreso,
        peso: this.data.ticket.PesoAPagar,
        precioPorQuintal: this.data.ticket.PrecioPorQuintal,
        Total: this.data.ticket.TotalAPagar,
        pesoBruto: this.data.ticket.PesoBruto,
        pesoNeto: this.data.ticket.PesoNeto,
        pesoSinImpurezas: this.data.ticket.PesoSinImpurezas,
        pesoTara: this.data.ticket.PesoTara,
        rubros: this.data.ticket._TipoRubro.Descripcion,
        presentacion: this.data.ticket._TipoPresentacionRubro.Descripcion,
        vehiculo: this.data.ticket._Vehiculo.Placa,
        porcentajeHumedad: this.data.ticket.PorcentajeHumedad,
        porcentajeImpureza: this.data.ticket.PorcentajeImpureza,
      }    
    }

    if(this.detalleTicket.vehiculo == "null") {
      this.porSaco = false;
      this.medidaPesoNeto = "q"
    } else { this.medidaPesoNeto = "kg" }
  }
}
 