import { Component, OnInit } from "@angular/core";
import { RubrosService } from "src/app/services/rubros.service";

@Component({
  selector: "app-venta-rubros",
  templateUrl: "./venta-rubros.component.html",
  styleUrls: ["./venta-rubros.component.css"],
})
export class VentaRubrosComponent implements OnInit {
  constructor(private rubrosService: RubrosService) {}
  selectedTab = 0;
  finalizarTicket() {
    this.selectedTab = 1;
  }
  ngOnInit() {
    this.rubrosService.refresh$.subscribe(() => {
      this.selectedTab = 0;
    });
  }
}
