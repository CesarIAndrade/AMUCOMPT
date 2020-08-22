import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { reportsUrl } from "../../../environments/environment";

@Component({
  selector: "app-modal-ticket-finalizado",
  templateUrl: "./modal-ticket-finalizado.component.html",
  styleUrls: ["./modal-ticket-finalizado.component.css"],
})
export class ModalTicketFinalizadoComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  detalleTicket: any = {};
  medidaPesoNeto = "kg";
  porCarro: boolean;
  porSaco: boolean;
  placaCarro: boolean;
  comprobanteVenta = "";
  medidaPesoSinImpureza = "q";
  tipoCliente = "";
  tipoComprobante = "";
  balanza: string;
  tipoTransaccion: string;

  imprimirComprobante() {
    if (this.data.ruta == "venta") {
      const { IdTicketVenta } = this.data.ticket;
      window.open(reportsUrl + `Reporte/Venta?Ticket=${IdTicketVenta}`);
    } else {
      const { IdTicket } = this.data.ticket;
      window.open(reportsUrl + `Reporte/Ticket?Ticket=${IdTicket}`);
    }
  }

  ngOnInit() {
    if (this.data.ruta == "venta") {
      this.medidaPesoSinImpureza = "";
      this.tipoCliente = "CLIENTE";
      this.tipoComprobante = "VENTA";
      this.balanza = "";
      this.detalleTicket = {
        codigo: this.data.ticket.Codigo,
        entrada: this.data.ticket.FechaIngreso,
        salida: this.data.ticket.FechaSalida
          ? this.data.ticket.FechaSalida
          : this.data.ticket.FechaIngreso,
        peso: this.data.ticket.PesoACobrar,
        precioPorQuintal: this.data.ticket.PrecioPorQuintal,
        total: this.data.ticket.TotalACobrar,
        pesoBruto: this.data.ticket.PesoBruto
          ? this.data.ticket.PesoBruto
          : this.data.ticket.PesoNeto,
        pesoSinImpurezas: null,
        pesoNeto: this.data.ticket.PesoNeto,
        pesoTara: this.data.ticket.PesoTara
          ? this.data.ticket.PesoTara
          : this.data.ticket.PesoNeto,
        cliente:
          this.data.ticket._PersonaCliente.PrimerNombre +
          " " +
          this.data.ticket._PersonaCliente.ApellidoPaterno +
          " " +
          this.data.ticket._PersonaCliente.ApellidoMaterno,
        cedulaCliente: this.data.ticket._PersonaCliente.NumeroDocumento,
        chofer: this.data.ticket._PersonaChofer
          ? this.data.ticket._PersonaChofer.PrimerNombre +
            " " +
            this.data.ticket._PersonaChofer.ApellidoPaterno +
            " " +
            this.data.ticket._PersonaChofer.ApellidoMaterno
          : null,
        cedulaChofer: this.data.ticket._PersonaChofer
          ? this.data.ticket._PersonaChofer.NumeroDocumento
          : null,
        vehiculo: this.data.ticket._Vehiculo
          ? this.data.ticket._Vehiculo.Placa.toUpperCase()
          : null,
        rubros: this.data.ticket._TipoRubro.Descripcion,
        presentacion: this.data.ticket._TipoPresentacionRubro.Descripcion,
        porcentajeHumedad: this.data.ticket.PorcentajeHumedad,
        porcentajeImpureza: this.data.ticket.PorcentajeImpureza,
      };
    } else {
      this.comprobanteVenta = "PESO PAGAR:";
      this.tipoCliente = "PROVEEDOR/CLIENTE";
      this.tipoComprobante = "COMPRA";
      this.balanza = "COMPRADOR/";
      this.detalleTicket = {
        codigo: this.data.ticket.Codigo,
        entrada: this.data.ticket.FechaIngreso,
        salida: this.data.ticket.FechaSalida
          ? this.data.ticket.FechaSalida
          : this.data.ticket.FechaIngreso,
        peso: this.data.ticket.PesoAPagar,
        precioPorQuintal: this.data.ticket.PrecioPorQuintal,
        total: this.data.ticket.TotalAPagar,
        pesoBruto: this.data.ticket.PesoBruto
          ? this.data.ticket.PesoBruto
          : this.data.ticket.PesoNeto,
        pesoNeto: this.data.ticket.PesoNeto,
        pesoSinImpurezas: this.data.ticket.PesoSinImpurezas,
        pesoTara: this.data.ticket.PesoTara
          ? this.data.ticket.PesoTara
          : this.data.ticket.PesoNeto,
        cliente:
          this.data.ticket._PersonaEntidad.PrimerNombre +
          " " +
          this.data.ticket._PersonaEntidad.ApellidoPaterno +
          " " +
          this.data.ticket._PersonaEntidad.ApellidoMaterno,
        cedulaCliente: this.data.ticket._PersonaEntidad.NumeroDocumento,
        rubros: this.data.ticket._TipoRubro.Descripcion,
        presentacion: this.data.ticket._TipoPresentacionRubro.Descripcion,
        porcentajeHumedad: this.data.ticket.PorcentajeHumedad,
        porcentajeImpureza: this.data.ticket.PorcentajeImpureza,
        vehiculo: this.data.ticket._Vehiculo
          ? this.data.ticket._Vehiculo.Placa.toUpperCase()
          : null,
      };
    }
    if (
      !this.data.ticket._Vehiculo ||
      this.data.ticket._Vehiculo.Placa == "null"
    ) {
      this.data.ruta == "venta"
        ? (this.placaCarro = true)
        : (this.placaCarro = false);
      this.porCarro = false;
      this.porSaco = false;
      this.medidaPesoNeto = "q";
      this.tipoTransaccion = 'SACO';
    } else {
      if (this.detalleTicket.cedulaChofer == this.detalleTicket.cedulaCliente) {
        this.porCarro = false;
      } else {
        this.data.ruta == "compra"
          ? (this.porCarro = false)
          : (this.porCarro = true);
      }
      this.placaCarro = true;
      this.porSaco = true;
      this.medidaPesoNeto = "kg";
      this.tipoTransaccion = 'CARRO';
    }
  }
}
 