import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { FormGroup, FormControl } from "@angular/forms";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { RubrosService } from "src/app/services/rubros.service";
import { openDialog } from "../../functions/global";

@Component({
  selector: "app-modal-modificar-datos-ticket-venta",
  templateUrl: "./modal-modificar-datos-ticket-venta.component.html",
  styleUrls: ["./modal-modificar-datos-ticket-venta.component.css"],
})
export class ModalModificarDatosTicketVentaComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private rubrosService: RubrosService,
    private modalModificarDatosTicketVentaComponent: MatDialogRef<
      ModalModificarDatosTicketVentaComponent
    >
  ) {
    this.myForm = new FormGroup({
      _precioPorQuintal: new FormControl(""),
      _porcentajeHumedad: new FormControl(""),
      _porcentajeImpureza: new FormControl(""),
    });
  }

  myForm: FormGroup;

  async modalModificarDatosTicketVenta() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.rubrosService.modalModificarDatosTicketVenta(
          this.data.ticket.IdTicketVenta,
          this.myForm.get("_precioPorQuintal").value,
          this.myForm.get("_porcentajeHumedad").value,
          this.myForm.get("_porcentajeImpureza").value,
          localStorage.getItem("miCuenta.idAsignacionTipoUsuario")
        );
        if (respuesta["codigo"] == "200") {
          this.modalModificarDatosTicketVentaComponent.close(true);
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        }
      }
    });
  }

  ngOnInit() {}
}
