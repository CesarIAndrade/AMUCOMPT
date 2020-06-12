import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { SeguimientoService } from "src/app/services/seguimiento.service";

@Component({
  selector: "app-creditos-abonos",
  templateUrl: "./creditos-abonos.component.html",
  styleUrls: ["./creditos-abonos.component.css"],
})
export class CreditosAbonosComponent implements OnInit {
  myForm: FormGroup;
  constructor(private seguimientoService: SeguimientoService) {
    this.myForm = new FormGroup({
      _cliente: new FormControl(""),
    });
  }

  validarFormulario() {
    if (this.myForm.valid) {
      this.consultarFacturasCliente();
    }
  }

  async consultarFacturasCliente() {
    var facturas = await this.seguimientoService.consultarFacturasCliente(
      this.myForm.get("_cliente").value
    );
    console.log(facturas);
  }

  ngOnInit() {}
}
