import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { RubrosService } from 'src/app/services/rubros.service';

@Component({
  selector: "app-compra-rubros",
  templateUrl: "./compra-rubros.component.html",
  styleUrls: ["./compra-rubros.component.css"],
})
export class CompraRubrosComponent implements OnInit {
  constructor(
    private rubrosService: RubrosService
  ) {}
  selectedTab = 0;
  finalizarTicket() {
    this.selectedTab = 1;
  }
  ngOnInit() {
    this.rubrosService.refresh$.subscribe(() => {
      this.selectedTab = 0;
    })
  }
}
