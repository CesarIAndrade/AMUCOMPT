import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { RubrosService } from "src/app/services/rubros.service";

@Component({
  selector: "app-compra-rubros-salida",
  templateUrl: "./compra-rubros-salida.component.html",
  styleUrls: ["./compra-rubros-salida.component.css"],
})
export class CompraRubrosSalidaComponent implements OnInit {
  myForm: FormGroup;
  constructor(private rubrosService: RubrosService) {
    this.myForm = new FormGroup({
      _idTicket: new FormControl(""),
      _pesoTara: new FormControl(""),
      _porcentajeHumedad: new FormControl(""),
      _precioPorQuintal: new FormControl(""),
      _porcentajeImpureza: new FormControl(""),
    });
  }
 
  async finalizarTicket() {
    var respuesta = await this.rubrosService.finalizarTicket(
      this.myForm.get("_idTicket").value,
      this.myForm.get("_pesoTara").value,
      this.myForm.get("_porcentajeHumedad").value,
      this.myForm.get("_precioPorQuintal").value,
      this.myForm.get("_porcentajeImpureza").value
    );
    console.log(respuesta);
  }

  ngOnInit() {
    this.rubrosService.refresh$.subscribe(() => {
      this.myForm.get("_idTicket").setValue(this.rubrosService.idTicket);
    })
  }
}
