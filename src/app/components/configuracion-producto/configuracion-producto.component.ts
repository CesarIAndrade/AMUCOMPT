import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InventarioService } from "src/app/services/inventario.service";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import sweetalert from "sweetalert";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-configuracion-producto",
  templateUrl: "./configuracion-producto.component.html",
  styleUrls: ["./configuracion-producto.component.css"],
})
export class ConfiguracionProductoComponent implements OnInit {
  constructor(private inventarioService: InventarioService) {
    this.myForm = new FormGroup({
      _campo: new FormControl("", [Validators.required]),
      _idCampo: new FormControl(""),
      // Solo para kit
      _idKit: new FormControl(""),
      _codigo: new FormControl(""),
      _descuento: new FormControl(""),
      _idDescuento: new FormControl(""),
    });
  }

  myForm: FormGroup;
  filterTipoProducto: string = "";
  titulo: string;
  suffix: string;
  encabezadoTabla: string;
  mostrarForm = true;
  soloParaKits = true;

  opciones = [
    {
      _id: "1",
      descripcion: "Tipo Producto",
    },
    {
      _id: "2",
      descripcion: "Presentaciones",
    },
    {
      _id: "3",
      descripcion: "Medidas",
    },
    {
      _id: "4",
      descripcion: "Kits",
    },
  ];
  registroDataSource = {
    _id: "",
    descripcion: "",
    utilizado: "",
    codigo: "",
    descuento: "",
  };
  descuentos: any[] = [];
  filteredDescuento: Observable<string[]>;

  // PAra la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Element[]>();

  consultarTipoProductos() {
    this.inventarioService
      .consultarTipoProductos(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.dataSource.data = [];
        var listaDataSource = [];
        ok["respuesta"].map((item) => {
          this.registroDataSource = {
            _id: item.IdTipoProducto,
            descripcion: item.Descripcion,
            utilizado: item.TipoUsuarioUtilizado,
            codigo: "",
            descuento: "",
          };
          listaDataSource.push(this.registroDataSource);
        });
        this.dataSource.data = listaDataSource;
        this.dataSource.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  crearTipoProducto() {
    this.inventarioService
      .crearTipoProducto(
        this.myForm.get("_campo").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.myForm.reset();
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Tipo Producto ya xiste!", {
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
          this.myForm.get("_campo").reset();
          this.myForm.setErrors({ invalid: true });
          this.consultarTipoProductos();
        }
      })
      .catch((error) => console.log(error));
  }

  eliminarTipoProducto(idTipoProducto) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ["Cancelar", "Ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.inventarioService
          .eliminarTipoProducto(
            idTipoProducto,
            localStorage.getItem("miCuenta.deleteToken")
          )
          .then((ok) => {
            if (ok["respuesta"]) {
              sweetAlert("Se a eliminado correctamente!", {
                icon: "success",
              });
              this.consultarTipoProductos();
            } else {
              sweetAlert("No se ha podido elminiar!", {
                icon: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }

  consultarPresentaciones() {
    this.inventarioService
      .consultarPresentaciones(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.dataSource.data = [];
        var listaDataSource = [];
        ok["respuesta"].map((item) => {
          this.registroDataSource = {
            _id: item.IdPresentacion,
            descripcion: item.Descripcion,
            utilizado: item.PresentacionUtilizado,
            codigo: "",
            descuento: "",
          };
          listaDataSource.push(this.registroDataSource);
        });
        this.dataSource.data = listaDataSource;
        this.dataSource.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  crearPresentacion() {
    this.inventarioService
      .crearPresentacion(
        this.myForm.get("_campo").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.myForm.reset();
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Presentación ya existe!", {
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
          this.myForm.get("_campo").reset();
          this.myForm.setErrors({ invalid: true });
          this.consultarPresentaciones();
        }
      })
      .catch((error) => console.log(error));
  }

  eliminarPresentacion(idPresentacion) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ["Cancelar", "Ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.inventarioService
          .eliminarPresentacion(
            idPresentacion,
            localStorage.getItem("miCuenta.deleteToken")
          )
          .then((ok) => {
            if (ok["respuesta"]) {
              sweetAlert("Se a eliminado correctamente!", {
                icon: "success",
              });
              this.consultarPresentaciones();
            } else {
              sweetAlert("No se ha podido elminiar!", {
                icon: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }

  consultarMedidas() {
    this.inventarioService
      .consultarMedidas(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.dataSource.data = [];
        var listaDataSource = [];
        ok["respuesta"].map((item) => {
          this.registroDataSource = {
            _id: item.IdMedida,
            descripcion: item.Descripcion,
            utilizado: item.MedidaUtilizado,
            codigo: "",
            descuento: "",
          };
          listaDataSource.push(this.registroDataSource);
        });
        this.dataSource.data = listaDataSource;
        this.dataSource.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  crearMedida() {
    this.inventarioService
      .crearMedida(
        this.myForm.get("_campo").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
          this.myForm.reset();
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Medida ya existe!", {
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
          this.myForm.get("_campo").reset();
          this.myForm.setErrors({ invalid: true });
          this.consultarMedidas();
        }
      })
      .catch((error) => console.log(error));
  }

  eliminarMedida(idMedida) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ["Cancelar", "Ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.inventarioService
          .eliminarMedida(
            idMedida,
            localStorage.getItem("miCuenta.deleteToken")
          )
          .then((ok) => {
            if (ok["respuesta"]) {
              sweetAlert("Se a eliminado correctamente!", {
                icon: "success",
              });
              this.consultarMedidas();
            } else {
              sweetAlert("No se ha podido elminiar!", {
                icon: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }

  consultarKits() {
    this.inventarioService
      .consultarKits(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.dataSource.data = [];
        var listaDataSource = [];
        ok["respuesta"].map((item) => {
          this.registroDataSource = {
            _id: item.IdKit,
            descripcion: item.Descripcion,
            utilizado: item.KitUtilizado,
            codigo: item.Codigo,
            descuento: item.AsignarDescuentoKit.Descuento.Porcentaje,
          };
          listaDataSource.push(this.registroDataSource);
        });
        this.dataSource.data = listaDataSource;
        this.dataSource.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  crearKit() {
    this.inventarioService
      .crearKit(
        this.myForm.get("_campo").value,
        this.myForm.get("_codigo").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (ok["respuesta"] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
        } else if (ok["respuesta"] == "400") {
          sweetAlert("Kit ya existe!", {
            icon: "warning",
          });
          this.myForm.reset();
        } else if (ok["respuesta"] == "false") {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.myForm.get("_idKit").setValue(ok["respuesta"]);
          this.crearDescuento();
        }
      })
      .catch((error) => console.log(error));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.descuentos.filter((option) =>
      option.Porcentaje.toLowerCase().includes(filterValue)
    );
  }

  consultarDescuentos() {
    this.inventarioService
      .consultarDescuentos(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.descuentos = [];
        for (let index = 0; index < ok["respuesta"].length; index++) {
          const element = ok["respuesta"][index];
          this.descuentos[index] = {
            IdDescuento: element.IdDescuento,
            Porcentaje: String(element.Porcentaje),
          };
        }
        this.filteredDescuento = this.myForm
          .get("_descuento")
          .valueChanges.pipe(
            startWith(""),
            map((value) => this._filter(value))
          );
      })
      .catch((error) => console.log(error));
  }

  crearDescuento() {
    this.inventarioService
      .crearDescuentoKit(
        this.myForm.get("_descuento").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        if (typeof ok["respuesta"] == "string") {
          this.myForm.get("_idDescuento").setValue(ok["respuesta"]);
          this.asignarDescuentoKit();
        } else {
          this.myForm.get("_idDescuento").setValue(ok["respuesta"].IdDescuento);
          this.asignarDescuentoKit();
        }
      })
      .catch((error) => console.log(error));
  }

  asignarDescuentoKit() {
    this.inventarioService
      .asignarDescuentoKit(
        this.myForm.get("_idKit").value,
        this.myForm.get("_idDescuento").value,
        localStorage.getItem("miCuenta.postToken")
      )
      .then((ok) => {
        this.myForm.get("_campo").reset();
        this.myForm.get("_codigo").reset();
        this.myForm.get("_descuento").reset();
        this.myForm.setErrors({ invalid: true });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        this.consultarKits();
        this.consultarDescuentos();
      });
  }

  eliminarKit(idKit) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ["Cancelar", "Ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.inventarioService
          .eliminarKit(idKit, localStorage.getItem("miCuenta.deleteToken"))
          .then((ok) => {
            if (ok["respuesta"]) {
              sweetAlert("Se a eliminado correctamente!", {
                icon: "success",
              });
              this.consultarKits();
            } else {
              sweetAlert("No se ha podido elminiar!", {
                icon: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  }

  actualizarOpcion(titulo, suffix, encabezadoTabla, tabla) {
    this.titulo = titulo;
    this.suffix = suffix;
    this.encabezadoTabla = encabezadoTabla;
    this.tabla = tabla;
  }

  setValidators() {
    this.myForm.get("_codigo").setValidators([Validators.required]);
    this.myForm.get("_descuento").setValidators([Validators.required]);
    this.myForm.get("_codigo").updateValueAndValidity();
    this.myForm.get("_descuento").updateValueAndValidity();
  }

  clearValidators() {
    this.myForm.get("_codigo").clearValidators();
    this.myForm.get("_descuento").clearValidators();
    this.myForm.get("_codigo").updateValueAndValidity();
    this.myForm.get("_descuento").updateValueAndValidity();
  }

  selecionarOpcion(opcion) {
    if (opcion.value === "1") {
      this.actualizarOpcion("Tipo Producto", "o", "Tipo Productos", [
        "descripcion",
        "acciones",
      ]);
      this.consultarTipoProductos();
    } else if (opcion.value === "2") {
      this.actualizarOpcion("Presentación", "a", "Presentaciones", [
        "descripcion",
        "acciones",
      ]);
      this.consultarPresentaciones();
    } else if (opcion.value === "3") {
      this.actualizarOpcion("Medida", "a", "Medidas", [
        "descripcion",
        "acciones",
      ]);
      this.consultarMedidas();
    } else if (opcion.value === "4") {
      this.actualizarOpcion("Kit", "o", "Kits", [
        "descripcion",
        "codigo",
        "descuento",
        "acciones",
      ]);
      this.consultarDescuentos();
      this.consultarKits();
    }
    if (opcion.value === "4") {
      this.soloParaKits = false;
      this.setValidators();
    } else {
      this.soloParaKits = true;
      this.clearValidators();
    }
    this.mostrarForm = false;
    this.myForm.reset();
    this.myForm.get("_idCampo").setValue(opcion.value);
    this.myForm.setErrors({ invalid: true });
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.myForm.get("_idCampo").value === "1") {
        this.crearTipoProducto();
      } else if (this.myForm.get("_idCampo").value === "2") {
        this.crearPresentacion();
      } else if (this.myForm.get("_idCampo").value === "3") {
        this.crearMedida();
      } else if (this.myForm.get("_idCampo").value === "4") {
        this.crearKit();
      }
    }
  }

  eliminarCampo(_id) {
    if (this.myForm.get("_idCampo").value === "1") {
      this.eliminarTipoProducto(_id);
    } else if (this.myForm.get("_idCampo").value === "2") {
      this.eliminarPresentacion(_id);
    } else if (this.myForm.get("_idCampo").value === "3") {
      this.eliminarMedida(_id);
    } else if (this.myForm.get("_idCampo").value === "4") {
      this.eliminarKit(_id);
    }
  }

  ngOnInit() {}

  tabla = ["descripcion", "acciones"];
}
