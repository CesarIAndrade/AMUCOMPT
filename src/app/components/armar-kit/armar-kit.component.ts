import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { salir, openDialog, openSnackBar } from '../../functions/global';

// Components
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// Material
import {
  MatPaginator,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";

// Services
import { InventarioService } from "src/app/services/inventario.service";

export interface DetalleProducto {
  presentacion: string;
  contenidoNeto: string;
  medida: string;
}

@Component({
  selector: "app-armar-kit",
  templateUrl: "./armar-kit.component.html",
  styleUrls: ["./armar-kit.component.css"],
})
export class ArmarKitComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      _idKit: new FormControl(""),
      _idAsignarDescuentoKit: new FormControl(""),
    });
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild("paginatorProductos", { static: false })
  paginatorProductos: MatPaginator;
  productos = new MatTableDataSource<Element[]>();
  listaProductosDeUnKit = new MatTableDataSource<Element[]>();

  myForm: FormGroup;
  filterProducto = "";
  kits: any[] = [];
  loadingP = false;
  loadingPK = false;

  onChangeSelectKit(idKit) {
    this.loadingPK = true;
    this.loadingP = true;
    this.productos.data = [];
    this.listaProductosDeUnKit.data = [];
    var kit = this.kits.filter((kit) => kit.IdKit == idKit);
    this.myForm
      .get("_idAsignarDescuentoKit")
      .setValue(kit[0].AsignarDescuentoKit.IdAsignarDescuentoKit);
    this.consultarKitsYSusProductos(idKit);
    this.consultarProductos(idKit);
  }

  async consultarKitsYSusProductos(idKit) {
    var kit = await this.inventarioService.consultarKitsYSusProductos(
      idKit,
      "Inventario/ListaAsignarProductoKit"
    );
    if (kit["codigo"] == "200") {
      this.loadingPK = false;
      var data: any = [];
      kit["respuesta"][0]["ListaAsignarProductoKit"].map((producto) => {
        data.push({
          _id: producto.IdAsignarProductoKit,
          codigo: producto.ListaProductos.Codigo,
          nombre: producto.ListaProductos.Producto.Nombre,
          descripcion:
            producto.ListaProductos.Presentacion.Descripcion +
            " " +
            producto.ListaProductos.CantidadMedida +
            " " +
            producto.ListaProductos.Medida.Descripcion,
          tipoProducto:
            producto.ListaProductos.Producto.TipoProducto.Descripcion,
          usado: producto.ListaProductos.ConfigurarProductosUtilizado,
        });
      });
      this.listaProductosDeUnKit.data = data;
      this.listaProductosDeUnKit.paginator = this.paginator;
    }
  }

  async consultarKits() {
    var kits = await this.inventarioService.consultarKits();
    if (kits["codigo"] == "200") {
      this.kits = kits["respuesta"];
    } else if (kits["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir())
    }
  }

  async consultarProductos(idKit) {
    var productos = await this.inventarioService.consultarProductosQueNoTieneUnKit(
      idKit
    );
    if (productos["codigo"] == "200") {
      this.loadingP = false;
      var data: any = [];
      productos["respuesta"].map((producto) => {
        data.push({
          _id: producto.IdConfigurarProducto,
          codigo: producto.Codigo,
          nombre: producto.Producto.Nombre,
          descripcion:
            producto.Presentacion.Descripcion +
            " " +
            producto.CantidadMedida +
            " " +
            producto.Medida.Descripcion,
          tipoProducto: producto.Producto.TipoProducto.Descripcion,
        });
      });
      this.productos.data = data;
      this.productos.paginator = this.paginatorProductos;
    }
  }

  async asignarProductoKit(idProducto) {
    this.loadingP = true;
    this.loadingPK = true;
    this.productos.data = [];
    this.listaProductosDeUnKit.data = [];
    var producto = await this.inventarioService.asignarProductoKit(
      idProducto,
      this.myForm.get("_idAsignarDescuentoKit").value
    );
    if (producto["codigo"] == "200") {
      this.consultarKitsYSusProductos(this.myForm.get("_idKit").value);
      this.consultarProductos(this.myForm.get("_idKit").value);
      openSnackBar("Se asignó correctamente");
    }
  }

  async eliminarAsignacionProductoKit(idProducto) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: ""
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.loadingP = true;
        this.loadingPK = true;
        this.productos.data = [];
        this.listaProductosDeUnKit.data = [];
        var producto = await this.inventarioService.eliminarAsignacionProductoKit(
          idProducto
        );
        if (producto["codigo"] == "200") {
          this.consultarKitsYSusProductos(this.myForm.get("_idKit").value);
          this.consultarProductos(this.myForm.get("_idKit").value);
          openSnackBar("Se eliminó correctamente");
        }
      }
    });
  }

  ngOnInit() {
    this.consultarKits();
  }

  tablaProductos = ["codigo", "descripcion", "tipoProducto", "acciones"];
  tablaProductosDeUnKit = ["codigo", "descripcion", "tipoProducto", "acciones"];
}
