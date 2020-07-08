import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

import * as jsPdf from "jspdf";
import html2canvas from "html2canvas";

import * as html2pdf from "html2pdf.js";
@Component({
  selector: "app-modal-ticket-finalizado",
  templateUrl: "./modal-ticket-finalizado.component.html",
  styleUrls: ["./modal-ticket-finalizado.component.scss"],
})
export class ModalTicketFinalizadoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  detalleTicket: any = {};

  medidaPesoNeto = "kg";
  porCarro = false;
  comprobanteVenta = "";
  medidaPesoSinImpureza = "q";
  tipoCliente = "";

  imprimirComprobante(encabezado) {
    // html2canvas(document.getElementById("comprobante"))
    // .then(canvas => {
    //   let imgData = canvas.toDataURL("image/png");
    //   let doc = new jsPdf();
    //   doc.addImage(imgData, 0,0,10,10);
    //   doc.save(`${encabezado}.pdf`)
    // })

    const element: HTMLElement = document.getElementById("comprobante");
    html2canvas(element, { scale: 3 }).then(async (canvas) => {
      const pdf = new jsPdf("l", "mm", "a5");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 3, 0, 205, 140);
      window.open(
        pdf.output("bloburl", { filename: `${encabezado}.pdf` }),
        "_blank"
      );
    });

    // const options = {
    //   filename: `${encabezado}.pdf`,
    //   image: { type: "jpeg" },
    //   html2canvas: {},
    //   jsPDF: { orientation: "l" },
    // };

    // html2pdf().from(document.getElementById("comprobante")).set(options).save();

    // html2pdf()
    // .from(document.getElementById("comprobante"))
    // .set(options)
    // .toPdf()
    // .get('pdf')
    // .then( async function (pdf) {
    //   await window.open(pdf.output('bloburl'), '_blank');
    // });

    // const doc = new jsPdf("l", "mm", "a5");
    // doc.setProperties({
    //   title: `${encabezado}.pdf`,
    // });
    // doc.fromHTML(document.getElementById("comprobante"), 10, 10, {
    //   width: 190,
    // });
    // doc.output("dataurlnewwindow");
  }

  ngOnInit() {
    console.log(this.data.ticket);
    
    if (this.data.ruta == "venta") {
      this.medidaPesoSinImpureza = "";
      this.tipoCliente = "Cliente";
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
        vehiculo: this.data.ticket._Vehiculo.Placa,
        rubros: this.data.ticket._TipoRubro.Descripcion,
        presentacion: this.data.ticket._TipoPresentacionRubro.Descripcion,
        porcentajeHumedad: this.data.ticket.PorcentajeHumedad,
        porcentajeImpureza: this.data.ticket.PorcentajeImpureza,
      };
    } else {
      this.comprobanteVenta = "Peso Pagar:";
      this.tipoCliente = "Proveedor";
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
        vehiculo: this.data.ticket._Vehiculo.Placa,
        rubros: this.data.ticket._TipoRubro.Descripcion,
        presentacion: this.data.ticket._TipoPresentacionRubro.Descripcion,
        porcentajeHumedad: this.data.ticket.PorcentajeHumedad,
        porcentajeImpureza: this.data.ticket.PorcentajeImpureza,
      };
    }

    if (this.data.ticket._Vehiculo.Placa == "null") {
      this.porCarro = false;
      this.medidaPesoNeto = "q";
    } else {
      this.data.ruta == "compra"
        ? (this.porCarro = false)
        : (this.porCarro = true);
      this.medidaPesoNeto = "kg";
    }
  }
}
