import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { switchMap } from 'rxjs/operators';

@Component({
  selector: "app-registrar-visita",
  templateUrl: "./registrar-visita.component.html",
  styleUrls: ["./registrar-visita.component.css"],
})
export class RegistrarVisitaComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      console.log(param.get("id"));
    });    
  }
}
