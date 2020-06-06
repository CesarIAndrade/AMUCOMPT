import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";

// Components
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
} from "@angular/material";
// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { InventarioService } from "src/app/services/inventario.service";

// SweetAlert
import sweetalert from "sweetalert";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { DialogAlertComponent } from "../dialog-alert/dialog-alert.component";

@Component({
  selector: "app-producto",
  templateUrl: "./producto.component.html",
  styleUrls: ["./producto.component.css"],
})
export class ProductoComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _nombre: new FormControl("", [Validators.required]),
      _tipoProducto: new FormControl("", [Validators.required]),
      _codigo: new FormControl("", [Validators.required]),
      _presentacion: new FormControl("", [Validators.required]),
      _contenidoNeto: new FormControl("", [Validators.required]),
      _medida: new FormControl("", [Validators.required]),
      _descripcion: new FormControl(""),
      _idProducto: new FormControl(""),
      _idConfiguracionProducto: new FormControl(""),
      _precio: new FormControl("", [Validators.required]),
      _idPrecio: new FormControl(""),
      _iva: new FormControl(""),
    });
  }

  myForm: FormGroup;
  botonIngresar = "ingresar";
  filterProducto = "";
  productosSeleccionado = false;
  tipoProductos: any[] = [];
  presentaciones: any[] = [];
  medidas: any[] = [];
  productosSeleccionables: any[] = [];
  filteredOptions: Observable<string[]>;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  productos = new MatTableDataSource<Element[]>();

  openDialog(mensaje): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: { mensaje: mensaje },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 2000,
      horizontalPosition: "right",
    });
  }

  async consultarTipoProductos() {
    var tipoProductos = await this.inventarioService.consultarTipoProductos();
    if (tipoProductos["codigo"] == "200") {
      this.tipoProductos = tipoProductos["respuesta"];
    }
  }

  async consultarPresentaciones() {
    var presentaciones = await this.inventarioService.consultarPresentaciones();
    if (presentaciones["codigo"] == "200") {
      this.presentaciones = presentaciones["respuesta"];
    }
  }

  async consultarMedidas() {
    var medidas = await this.inventarioService.consultarMedidas();
    if (medidas["codigo"] == "200") {
      this.medidas = medidas["respuesta"];
    }
  }

  async consultarConfiguracionProductoTodos() {
    var respuesta = await this.inventarioService.consultarConfiguracionProductoTodos();
  }

  async consultarProductos() {
    var respuesta = await this.inventarioService.consultarConfiguracionProducto();
    if (respuesta["codigo"] == "200") {
      var productos: any = [];
      console.log(respuesta["respuesta"][0]);
      respuesta["respuesta"].map((producto) => {
        productos.push({
          IdConfigurarProducto: producto.IdConfigurarProducto,
          IdProducto: producto.Producto.IdProducto,
          Codigo: producto.Codigo,
          Producto: producto.Producto.Nombre,
          Presentacion: producto.Presentacion.Descripcion,
          Contenido: producto.CantidadMedida,
          Medida: producto.Medida.Descripcion,
          IdMedida: producto.Medida.IdMedida,
          IdPresentacion: producto.Presentacion.IdPresentacion,
          IdTipoProducto: producto.Producto.TipoProducto.IdTipoProducto,
          TipoProducto: producto.Producto.TipoProducto.Descripcion,
          IdPrecio:
            producto.PrecioConfigurarProducto.IdPrecioConfigurarProducto,
          Precio: producto.PrecioConfigurarProducto.Precio,
          Descripcion: producto.Producto.Descripcion,
          Iva: producto.Iva,
          ConfigurarProductosUtilizado: producto.ConfigurarProductosUtilizado,
        });
      });
      this.productosSeleccionables = productos;
      this.productos.data = productos;
      this.productos.paginator = this.paginator;
      this.filteredOptions = this.myForm.get("_nombre").valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productosSeleccionables.filter((option) =>
      option.Nombre.toLowerCase().includes(filterValue)
    );
  }

  seleccionarProductoSiExiste(producto) {
    this.myForm.get("_nombre").disable();
    this.myForm.get("_tipoProducto").disable();
    this.myForm.get("_idProducto").setValue(producto.IdProducto);
    this.myForm.get("_tipoProducto").setValue(producto.IdTipoProducto);
    this.myForm.get("_descripcion").setValue(producto.Observacion);
    this.myForm.get("_codigo").setValue(producto.Codigo);
    this.productosSeleccionado = true;
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == "ingresar") {
        this.crearProducto();
      } else if (this.botonIngresar == "modificar") {
        this.actualizarConfiguracionProducto();
      }
    }
  }

  async crearProducto() {
    if (!this.productosSeleccionado) {
      var producto = await this.inventarioService.crearProducto(
        this.myForm.get("_nombre").value,
        this.myForm.get("_descripcion").value,
        this.myForm.get("_tipoProducto").value
      );
      if (producto["codigo"] == "200") {
        this.crearConfiguracionProducto(producto["respuesta"].IdProducto);
      }
    } else {
      this.crearConfiguracionProducto(this.myForm.get("_idProducto").value);
    }
  }

  async crearConfiguracionProducto(idProducto) {
    var configuracionProducto = await this.inventarioService.crearConfiguracionProducto(
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      idProducto,
      this.myForm.get("_medida").value,
      this.myForm.get("_presentacion").value,
      this.myForm.get("_codigo").value,
      this.myForm.get("_contenidoNeto").value,
      this.myForm.get("_iva").value
    );
    if (configuracionProducto["codigo"] == "200") {
      this.crearPrecio(
        configuracionProducto["respuesta"].IdConfigurarProducto,
        true
      );
    }
  }

  async crearPrecio(idConfigurarProducto, flag) {
    var precio = await this.inventarioService.crearPrecio(
      idConfigurarProducto,
      this.myForm.get("_precio").value
    );
    if (precio["codigo"] == "200") {
      if (flag) {
        this.openSnackBar("Se ingresó correctamente");
      } else {
        this.openSnackBar("Se actualizó correctamente");
        this.botonIngresar = "ingresar";
      }
      this.myForm.reset();
      this.consultarProductos();
      this.productosSeleccionado = false;
      this.myForm.get("_nombre").enable();
      this.myForm.get("_tipoProducto").enable();
    }
  }

  mostrarProducto(producto) {
    if (producto.ConfigurarProductosUtilizado == "0") {
      this.myForm.enable();
      this.myForm.get("_nombre").disable();
      this.myForm.get("_tipoProducto").disable();
    } else {
      this.myForm.disable(), this.myForm.get("_precio").enable();
      this.myForm.get("_iva").enable();
    }
    this.myForm
      .get("_idConfiguracionProducto")
      .setValue(producto.IdConfigurarProducto);
    this.myForm.get("_idProducto").setValue(producto.IdProducto);
    this.myForm.get("_nombre").setValue(producto.Producto);
    this.myForm.get("_codigo").setValue(producto.Codigo);
    this.myForm.get("_tipoProducto").setValue(producto.IdTipoProducto);
    this.myForm.get("_presentacion").setValue(producto.IdPresentacion);
    this.myForm.get("_contenidoNeto").setValue(producto.Contenido);
    this.myForm.get("_medida").setValue(producto.IdMedida);
    this.myForm.get("_precio").setValue(producto.Precio);
    this.myForm.get("_iva").setValue(producto.Iva);
    this.myForm.get("_descripcion").setValue(producto.Descripcion);
    this.botonIngresar = "modificar";
  }

  async actualizarConfiguracionProducto() {
    var respuesta = await this.inventarioService.actualizarConfiguracionProducto(
      this.myForm.get("_idConfiguracionProducto").value,
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      this.myForm.get("_idProducto").value,
      this.myForm.get("_medida").value,
      this.myForm.get("_presentacion").value,
      this.myForm.get("_codigo").value,
      this.myForm.get("_contenidoNeto").value,
      this.myForm.get("_iva").value
    );
    if (respuesta["codigo"] == "200") {
      this.crearPrecio(respuesta["respuesta"].IdConfigurarProducto, false);
    }
  }

  async eliminarConfiguracionProducto(idConfigurarProducto, idProducto) {
    var respuesta = await this.inventarioService.eliminarConfiguracionProducto(
      idConfigurarProducto,
      idProducto
    );
    if (respuesta["codigo"] == "200") {
      this.openSnackBar("Se eliminó correctamente");
      var productos = this.productos.data;
      var producto = productos.filter(
        (item) => item["IdConfigurarProducto"] == idConfigurarProducto
      );
      var index = productos.indexOf(producto[0]);
      productos.splice(index, 1);
      this.productos.data = productos;
    }
  }

  ngOnInit() {
    this.consultarProductos();
    this.consultarTipoProductos();
    this.consultarMedidas();
    this.consultarPresentaciones();
  }

  tablaProductos = [
    "codigo",
    "producto",
    "tipoProducto",
    "presentacion",
    "contenido",
    "medida",
    "descripcion",
    "precio",
    "iva",
    "acciones",
  ];
}
