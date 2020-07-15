import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { imgUrl } from "../../functions/variables";

import * as jsPdf from "jspdf";
import html2canvas from "html2canvas";

import * as html2pdf from "html2pdf.js";

@Component({
  selector: "app-modal-ticket-finalizado",
  templateUrl: "./modal-ticket-finalizado.component.html",
  styleUrls: ["./modal-ticket-finalizado.component.css"],
})
export class ModalTicketFinalizadoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  detalleTicket: any = {};

  medidaPesoNeto = "kg";
  porCarro: boolean;
  porSaco: boolean;
  comprobanteVenta = "";
  medidaPesoSinImpureza = "q";
  tipoCliente = "";
  tipoComprobante = "";

  imprimirComprobante(encabezado) {
    const element: HTMLElement = document.getElementById("comprobante");
    html2canvas(element, { scale: 4 }).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPdf("l", "mm", "a5");
      doc.addImage(img, "PNG", 30, 5, 150, 130);
      window.open(doc.output("bloburl"));
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

    // var specialElementHandler = {
    //   "#editor": function(element, renderer) {
    //     return true;
    //   }
    // }
    // const doc = new jsPdf("l", "mm", "a5");
    // doc.setProperties({
    //   title: `${encabezado}.pdf`,
    // });
    // // doc.fromHTML(document.getElementById("tabla"), 10, 45);
    // doc.addImage(imgUrl, "JPEG", 25, 5, 160, 35);
    // // doc.text(element, 10, 10)
    // doc.output("dataurlnewwindow");
    // // doc.save();
  }

  ngOnInit() {
    console.log(this.data.ticket);

    if (this.data.ruta == "venta") {
      this.medidaPesoSinImpureza = "";
      this.tipoCliente = "Cliente";
      this.tipoComprobante = "Venta";
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
          ? this.data.ticket._Vehiculo.Placa
          : null,
        rubros: this.data.ticket._TipoRubro.Descripcion,
        presentacion: this.data.ticket._TipoPresentacionRubro.Descripcion,
        porcentajeHumedad: this.data.ticket.PorcentajeHumedad,
        porcentajeImpureza: this.data.ticket.PorcentajeImpureza,
      };
    } else {
      this.comprobanteVenta = "Peso Pagar:";
      this.tipoCliente = "Proveedor";
      this.tipoComprobante = "Compra";
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
      };
    }

    if (
      !this.data.ticket._Vehiculo ||
      this.data.ticket._Vehiculo.Placa == "null"
    ) {
      this.porCarro = false;
      this.porSaco = false;
      this.medidaPesoNeto = "q";
    } else {
      this.data.ruta == "compra"
        ? (this.porCarro = false)
        : (this.porCarro = true);
      this.porSaco = true;
      this.medidaPesoNeto = "kg";
    }
  }
}
