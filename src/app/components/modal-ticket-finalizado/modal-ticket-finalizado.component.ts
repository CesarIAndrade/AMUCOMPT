import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-modal-ticket-finalizado",
  templateUrl: "./modal-ticket-finalizado.component.html",
  styleUrls: ["./modal-ticket-finalizado.component.css"],
})
export class ModalTicketFinalizadoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  detalleTicket = {
    codigo: "",
    entrada: "",
    salida: "",
    pesoAPagar: "",
    precioPorQuintal: "",
    TotalAPagar: "",
    pesoBruto: "",
    pesoNeto: "",
    pesoSinImpurezas: "",
    pesoTara: "",
    porcentajeHumedad: "",
    porcentajeImpureza: "",
    rubros: "",
    presentacion: "",
    vehiculo: "",
  }

  ngOnInit() {
    console.log(this.data);
    this.detalleTicket = {
      codigo: this.data.ticket.Codigo,
      entrada: this.data.ticket.FechaIngreso,
      salida: this.data.ticket.FechaSalida,
      pesoAPagar: this.data.ticket.PesoAPagar,
      precioPorQuintal: this.data.ticket.PrecioPorQuintal,
      TotalAPagar: this.data.ticket.TotalAPagar,
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
    // Codigo: "AMUCOMT 0001"
    // FechaIngreso: "2020-06-26T00:02:00"
    // FechaSalida: "2020-06-26T00:02:00"
    // PesoAPagar: -0.12
    // PesoBruto: 12
    // PesoNeto: -9
    // PesoSinImpurezas: -7.02
    // PesoTara: 21
    // PorcentajeHumedad: 12
    // PorcentajeImpureza: 22
    // PrecioPorQuintal: 12
    // TotalAPagar: -1.8
    //  _TipoRubro: Descripcion: "MAIZ"
    // _TipoPresentacionRubro: Descripcion: "CARRO"
    // _Vehiculo: Placa: "geh944";
  }
}
