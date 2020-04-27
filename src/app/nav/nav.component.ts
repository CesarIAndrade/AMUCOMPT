import { Component, ViewChild, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { MatSidenav } from "@angular/material";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  @ViewChild("drawer", { static: true }) drawer: MatSidenav;
  @ViewChild("sidenav", { static: false }) sidenav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activated_route: ActivatedRoute
  ) {
    router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd)
      )
      .subscribe((_) => {
        this.drawer.close();
        var temp_route: any = this.router.url.split("/");
        temp_route = temp_route[1];
        this.route = temp_route.toUpperCase();
      });
  }

  route = "";
  nav_items = [];

  ngOnInit() {
    if (localStorage.getItem("miCuenta.tipoUsuario") == "1") {
      this.nav_items.push(
        {
          name: "Usuarios",
          icon: "person",
          url: "/usuarios",
        },
        {
          name: "Personas",
          icon: "contacts",
          url: "/personas",
        },
        {
          name: "Conf. Productos",
          icon: "settings",
          url: "/configuracion-productos",
        },
        {
          name: "Inventario",
          icon: "storage",
          url: "/inventarios",
        },
        {
          name: "Stock",
          icon: "list_alt",
          url: "/stock",
        },
        {
          name: "Abonos",
          icon: "attach_money",
          url: "/abonos",
        },
        {
          name: "Compra Inventario",
          icon: "shop",
          url: "/compras",
        },
        {
          name: "Compra Rubros",
          icon: "shopping_cart",
          url: "/compras-rubros",
        },
        {
          name: "Venta Inventario",
          icon: "shop",
          url: "/ventas",
        },
        {
          name: "Venta Rubros",
          icon: "shopping_cart",
          url: "/ventas-rubros",
        },
        {
          name: "Localidades",
          icon: "where_to_vote",
          url: "/localizaciones",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    } else if (localStorage.getItem("miCuenta.tipoUsuario") == "2") {
      this.nav_items.push(
        {
          name: "Stock",
          icon: "list_alt",
          url: "/stock",
        },
        {
          name: "Compra Inventario",
          icon: "shop",
          url: "/compras",
        },
        {
          name: "Compra Rubros",
          icon: "shopping_cart",
          url: "/compras-rubros",
        },
        {
          name: "Venta Inventario",
          icon: "shop",
          url: "/ventas",
        },
        {
          name: "Venta Rubros",
          icon: "shopping_cart",
          url: "/ventas-rubros",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    } else if (localStorage.getItem("miCuenta.tipoUsuario") == "3") {
      this.nav_items.push(
        {
          name: "Conf. Productos",
          icon: "settings",
          url: "/configuracion-productos",
        },
        {
          name: "Inventario",
          icon: "storage",
          url: "/inventarios",
        },
        {
          name: "Stock",
          icon: "list_alt",
          url: "/stock",
        },
        {
          name: "Abonos",
          icon: "attach_money",
          url: "/abonos",
        },
        {
          name: "Localidades",
          icon: "where_to_vote",
          url: "/localizaciones",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    }
    var temp_route: any = this.router.url.split("/");
    temp_route = temp_route[1];
    this.route = temp_route.toUpperCase();
    this.router.events.subscribe((_) => {
      var temp_route: any = this.router.url.split("/");
      temp_route = temp_route[1];
      this.route = temp_route.toUpperCase();
    });
  }
}
