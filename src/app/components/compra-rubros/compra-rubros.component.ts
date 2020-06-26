import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "app-compra-rubros",
  templateUrl: "./compra-rubros.component.html",
  styleUrls: ["./compra-rubros.component.css"],
})
export class CompraRubrosComponent implements OnInit {
  constructor() {}
  selectedTab = 0;
  finalizarTicket() {
    this.selectedTab = 1;
  }
  ngOnInit() {}
}
