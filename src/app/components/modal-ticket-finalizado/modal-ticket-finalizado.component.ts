import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { runInThisContext } from 'vm';

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

  compraPorSaco = true;
  medidaPesoNeto: string;
  ngOnInit() {
    console.log(this.data);
    this.detalleTicket = {
      codigo: this.data.ticket.Codigo,
      entrada: this.data.ticket.FechaIngreso,
      salida: this.data.ticket.FechaSalida ? this.data.ticket.FechaSalida : this.data.ticket.FechaIngreso,
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
    if(this.detalleTicket.vehiculo == "null") {
      this.compraPorSaco = false;
      this.medidaPesoNeto = "q"
    } else { this.medidaPesoNeto = "kg" }
  }
}
