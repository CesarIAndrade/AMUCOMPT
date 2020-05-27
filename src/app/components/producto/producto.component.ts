import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";

// Components
import { ModalDetalleProductoComponent } from "../modal-detalle-producto/modal-detalle-producto.component";
import {
  MatPaginator,
  MatTableDataSource,
  MatPaginatorIntl,
} from "@angular/material";
// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { InventarioService } from "src/app/services/inventario.service";

// SweetAlert
import sweetalert from "sweetalert";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { LoginComponent } from "../login/login.component";

@Component({
  selector: "app-producto",
  templateUrl: "./producto.component.html",
  styleUrls: ["./producto.component.css"],
})
export class ProductoComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog
  ) {
    this.myForm = new FormGroup({
      _nombre: new FormControl("", [Validators.required]),
      _tipoProducto: new FormControl("", [Validators.required]),
      _codigo: new FormControl("", [Validators.required]),
      _presentacion: new FormControl("", [Validators.required]),
      _contenidoNeto: new FormControl("", [Validators.required]),
      _medida: new FormControl("", [Validators.required]),
      _descripcion: new FormControl(""),
      _productoExistente: new FormControl(""),
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

  filteredOptions: Observable<string[]>;

  nombresDeProductos: any[] = [];
  tipoProductos: any[] = [];
  presentaciones: any[] = [];
  medidas: any[] = [];
  ArrayProductos: any[] = [];

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  productos = new MatTableDataSource<Element[]>();

  applyFilter(event) {
    this._filterTable(event, this.productos.data);
  }

  consultarTipoProductos() {
    this.inventarioService
      .consultarTipoProductos(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.tipoProductos = [];
        this.tipoProductos = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  consultarPresentaciones() {
    this.inventarioService
      .consultarPresentaciones(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.presentaciones = [];
        this.presentaciones = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  consultarMedidas() {
    this.inventarioService
      .consultarMedidas(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.medidas = [];
        this.medidas = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  consultarConfiguracionProductoTodos() {
    this.inventarioService
      .consultarConfiguracionProductoTodos(
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.productos.data = [];
        this.productos.data = ok["respuesta"];
        this.productos.paginator = this.paginator;
        this.ArrayProductos = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  consultarProductos() {
    this.inventarioService
      .consultarConfiguracionProducto(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        for (let index = 0; index < ok["respuesta"].length; index++) {
          const element = ok["respuesta"][index];
          this.nombresDeProductos[index] = {
            idProducto: element.Producto.IdProducto,
            nombre: element.Producto.Nombre,
            idTipoProducto: element.Producto.TipoProducto.IdTipoProducto,
            descripcion: element.Producto.Descripcion,
            codigo: element.Producto.Codigo,
            idMedida: element.Medida.IdMedida,
          };
        }
        this.consultarConfiguracionProductoTodos();
        this.consultarTipoProductos();
        this.filteredOptions = this.myForm.get("_nombre").valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value))
        );
      })
      .catch((error) => console.log(error));
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

  crearProducto() {
    if (
      this.myForm.get("_idProducto").value == "" &&
      this.myForm.get("_productoExistente").value == ""
    ) {
      this.inventarioService
        .crearProducto(
          this.myForm.get("_nombre").value,
          this.myForm.get("_descripcion").value,
          this.myForm.get("_tipoProducto").value,
          localStorage.getItem("miCuenta.postToken")
        )
        .then((ok) => {
          if (ok["respuesta"] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok["respuesta"] == "400") {
            sweetAlert("Producto Ya Existe!", {
              icon: "warning",
            });
          } else if (ok["respuesta"] == "false") {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            this.myForm.get("_idProducto").setValue(ok["respuesta"]);
            this.crearConfiguracionProducto();
          }
        })
        .catch((error) => console.log(error));
    } else {
      this.crearConfiguracionProducto();
    }
  }

  crearConfiguracionProducto() {
    this.inventarioService
      .crearConfiguracionProducto(
        localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
        this.myForm.get("_idProducto").value,
        this.myForm.get("_medida").value,
        this.myForm.get("_presentacion").value,
        this.myForm.get("_codigo").value,
        this.myForm.get("_contenidoNeto").value,
        this.myForm.get("_iva").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.myForm.reset();
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Producto Ya Existe!", {
            icon: "warning",
          });
        } else if (ok["respuesta"] == "false") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          this.myForm
            .get("_idConfiguracionProducto")
            .setValue(ok["respuesta"].IdConfigurarProducto);
          this.crearPrecio();
        }
      })
      .catch((error) => console.log(error));
  }

  crearPrecio() {
    this.inventarioService
      .crearPrecio(
        this.myForm.get("_idConfiguracionProducto").value,
        this.myForm.get("_precio").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.myForm.reset();
          this.myForm.get("_idProducto").setValue("");
          this.myForm.get("_productoExistente").setValue("");
          this.consultarProductos();
          this.myForm.get("_nombre").enable();
          this.myForm.get("_descripcion").enable();
          this.myForm.get("_codigo").enable();
          this.myForm.get("_tipoProducto").enable();
        } else {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        }
      })
      .catch((error) => console.log(error));
  }

  mostrarProducto(producto) {
    this.myForm.get("_nombre").disable();
    this.myForm.get("_descripcion").disable();
    this.myForm.get("_tipoProducto").disable();
    this.myForm
      .get("_idConfiguracionProducto")
      .setValue(producto.IdConfigurarProducto);
    this.myForm.get("_nombre").setValue(producto.Producto.Nombre);
    this.myForm.get("_descripcion").setValue(producto.Producto.Descripcion);
    this.myForm.get("_codigo").setValue(producto.Codigo);
    this.myForm.get("_contenidoNeto").setValue(producto.CantidadMedida);
    this.myForm
      .get("_tipoProducto")
      .setValue(producto.Producto.TipoProducto.IdTipoProducto);
    this.myForm
      .get("_presentacion")
      .setValue(producto.Presentacion.IdPresentacion);
    this.myForm.get("_medida").setValue(producto.Medida.IdMedida);
    this.myForm.get("_idProducto").setValue(producto.Producto.IdProducto);
    this.myForm
      .get("_precio")
      .setValue(producto.PrecioConfigurarProducto.Precio);
    this.myForm
      .get("_idConfiguracionProducto")
      .setValue(producto.PrecioConfigurarProducto.IdConfigurarProducto);
    this.myForm.get("_iva").setValue(producto.Iva);
    this.botonIngresar = "modificar";
  }

  actualizarConfiguracionProducto() {
    this.inventarioService
      .actualizarConfiguracionProducto(
        this.myForm.get("_idConfiguracionProducto").value,
        localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
        this.myForm.get("_idProducto").value,
        this.myForm.get("_medida").value,
        this.myForm.get("_presentacion").value,
        this.myForm.get("_codigo").value,
        this.myForm.get("_contenidoNeto").value,
        this.myForm.get("_iva").value,
        localStorage.getItem("miCuenta.putToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.myForm.reset();
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Producto Ya Existe!", {
            icon: "warning",
          });
        } else if (ok["respuesta"] == "false") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.crearPrecio();
        }
      })
      .catch((error) => console.log(error));
  }

  actualizarPrecio() {
    this.inventarioService
      .actualizarPrecio(
        this.myForm.get("_idPrecio").value,
        this.myForm.get("_idConfiguracionProducto").value,
        this.myForm.get("_precio").value,
        localStorage.getItem("miCuenta.putToken")
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          this.myForm.reset();
          this.botonIngresar = "ingresar";
          this.consultarProductos();
          this.myForm.get("_nombre").enable();
          this.myForm.get("_descripcion").enable();
          this.myForm.get("_codigo").enable();
          this.myForm.get("_tipoProducto").enable();
        }
      })
      .catch((error) => console.log(error));
  }

  eliminarConfiguracionProducto(producto) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ["Cancelar", "Ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.inventarioService
          .eliminarConfiguracionProducto(
            producto.IdConfigurarProducto,
            producto.Producto.IdProducto,
            localStorage.getItem("miCuenta.deleteToken")
          )
          .then((ok) => {
            this.consultarProductos();
          })
          .catch((error) => console.log(error));
      }
    });
  }

  mostrarDetalleProducto(producto) {
    var detalleProducto: any;
    detalleProducto = {
      presentacion: producto.Presentacion.Descripcion,
      contenidoNeto: producto.CantidadMedida,
      medida: producto.Medida.Descripcion,
    };
    let dialogRef = this.dialog.open(ModalDetalleProductoComponent, {
      width: "auto",
      height: "auto",
      data: {
        producto: detalleProducto,
      },
    });
  }

  seleccionarProductoSiExiste(producto) {
    this.myForm.get("_nombre").disable();
    this.myForm.get("_descripcion").disable();
    this.myForm.get("_tipoProducto").disable();
    this.myForm.get("_idProducto").setValue(producto.idProducto);
    this.myForm.get("_productoExistente").setValue(producto.nombre);
    this.myForm.get("_tipoProducto").setValue(producto.idTipoProducto);
    this.myForm.get("_descripcion").setValue(producto.descripcion);
    this.myForm.get("_codigo").setValue(producto.codigo);
  }

  ngOnInit() {
    this.consultarProductos();
    this.consultarMedidas();
    this.consultarPresentaciones();
  }

  tablaProductos = [
    "codigo",
    "descripcion",
    "tipoProducto",
    "precio",
    "acciones",
  ];

  private _filterTable(value: string, arreglo: any[]) {
    const filterValue = value;
    if (value == "") {
      this.productos.data = this.ArrayProductos;
    } else {
      this.productos.data = this.ArrayProductos.filter((option) =>
        (
          option["Producto"]["Nombre"] +
          option["Presentacion"]["Descripcion"] +
          option["Medida"]["Descripcion"]
        )
          .trim()
          .toUpperCase()
          .includes(filterValue.trim().toUpperCase())
      );
    }
  }

  private _filter(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
      return this.nombresDeProductos.filter((option) =>
        option.nombre.toLowerCase().includes(filterValue)
      );
    } catch (error) {}
  }
}
