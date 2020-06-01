import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InventarioService } from "src/app/services/inventario.service";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSnackBar,
} from "@angular/material";
import sweetalert from "sweetalert";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-configuracion-producto",
  templateUrl: "./configuracion-producto.component.html",
  styleUrls: ["./configuracion-producto.component.css"],
})
export class ConfiguracionProductoComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    private _snackBar: MatSnackBar
  ) {
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
  filter = "";
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
  descuentos: any[] = [];
  filteredDescuento: Observable<string[]>;

  // PAra la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Element[]>();

  openSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 2000,
      horizontalPosition: "right",
    });
  }

  async consultarTipoProductos() {
    var respuesta = await this.inventarioService.consultarTipoProductos();
    if (respuesta["codigo"] == "200") {
      var tipoProductos: any = [];
      respuesta["respuesta"].map((item) => {
        tipoProductos.push({
          _id: item.IdTipoProducto,
          descripcion: item.Descripcion,
          utilizado: item.TipoUsuarioUtilizado,
          codigo: "",
          descuento: "",
        });
        this.dataSource.data = tipoProductos;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  async crearTipoProducto() {
    var tipoProducto = await this.inventarioService.crearTipoProducto(
      this.myForm.get("_campo").value
    );
    console.log(tipoProducto);
  }

  async eliminarTipoProducto(idTipoProducto) {
    var respuesta = await this.inventarioService.eliminarTipoProducto(
      idTipoProducto
    );
    console.log(respuesta);
  }

  async consultarPresentaciones() {
    var respuesta = await this.inventarioService.consultarPresentaciones();
    if (respuesta["codigo"] == "200") {
      var presentaciones: any = [];
      respuesta["respuesta"].map((item) => {
        presentaciones.push({
          _id: item.IdPresentacion,
          descripcion: item.Descripcion,
          utilizado: item.PresentacionUtilizado,
          codigo: "",
          descuento: "",
        });
      });
      this.dataSource.data = presentaciones;
      this.dataSource.paginator = this.paginator;
    }
  }

  async crearPresentacion() {
    var respuesta = await this.inventarioService.crearPresentacion(
      this.myForm.get("_campo").value
    );
    console.log(respuesta);
  }

  async eliminarPresentacion(idPresentacion) {
    var respuesta = await this.inventarioService.eliminarPresentacion(
      idPresentacion
    );
    console.log(respuesta);
  }

  async consultarMedidas() {
    var respuesta = await this.inventarioService.consultarMedidas();
    if (respuesta["codigo"] == "200") {
      var medidas: any = [];
      respuesta["respuesta"].map((item) => {
        medidas.push({
          _id: item.IdMedida,
          descripcion: item.Descripcion,
          utilizado: item.MedidaUtilizado,
          codigo: "",
          descuento: "",
        });
      });
      this.dataSource.data = medidas;
      this.dataSource.paginator = this.paginator;
    }
  }

  async crearMedida() {
    var respuesta = await this.inventarioService.crearMedida(
      this.myForm.get("_campo").value
    );
    console.log(respuesta);
  }

  async eliminarMedida(idMedida) {
    var respuesta = await this.inventarioService.eliminarMedida(idMedida);
    console.log(respuesta);
  }

  async consultarKits() {
    var respuesta = await this.inventarioService.consultarKits();
    if (respuesta["codigo"] == "200") {
      var kits: any = [];
      respuesta["respuesta"].map((item) => {
        kits.push({
          _id: item.IdKit,
          descripcion: item.Descripcion,
          utilizado: item.KitUtilizado,
          codigo: item.Codigo,
          descuento: item.AsignarDescuentoKit.Descuento.Porcentaje,
        });
      });
      this.dataSource.data = kits;
      this.dataSource.paginator = this.paginator;
    }
  }

  async crearKit() {
    var respuesta = await this.inventarioService.crearKit(
      this.myForm.get("_campo").value,
      this.myForm.get("_codigo").value
    );
    console.log(respuesta);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.descuentos.filter((option) =>
      option.Porcentaje.toLowerCase().includes(filterValue)
    );
  }

  async consultarDescuentos() {
    var respuesta = await this.inventarioService.consultarDescuentos();
    console.log(respuesta);

    // .then((ok) => {
    //   this.descuentos = [];
    //   for (let index = 0; index < ok["respuesta"].length; index++) {
    //     const element = ok["respuesta"][index];
    //     this.descuentos[index] = {
    //       IdDescuento: element.IdDescuento,
    //       Porcentaje: String(element.Porcentaje),
    //     };
    //   }
    //   this.filteredDescuento = this.myForm
    //     .get("_descuento")
    //     .valueChanges.pipe(
    //       startWith(""),
    //       map((value) => this._filter(value))
    //     );
    // })
    // .catch((error) => console.log(error));
  }

  async crearDescuento() {
    var respuesta = await this.inventarioService.crearDescuentoKit(
      this.myForm.get("_descuento").value
    );
    console.log(respuesta);

    // .then((ok) => {
    //   if (typeof ok["respuesta"] == "string") {
    //     this.myForm.get("_idDescuento").setValue(ok["respuesta"]);
    //     this.asignarDescuentoKit();
    //   } else {
    //     this.myForm.get("_idDescuento").setValue(ok["respuesta"].IdDescuento);
    //     this.asignarDescuentoKit();
    //   }
    // })
    // .catch((error) => console.log(error));
  }

  async asignarDescuentoKit() {
    var respuesta = await this.inventarioService.asignarDescuentoKit(
      this.myForm.get("_idKit").value,
      this.myForm.get("_idDescuento").value
    );
    console.log(respuesta);

    // .then((ok) => {
    //   this.myForm.get("_campo").reset();
    //   this.myForm.get("_codigo").reset();
    //   this.myForm.get("_descuento").reset();
    //   this.myForm.setErrors({ invalid: true });
    // })
    // .catch((error) => console.log(error))
    // .finally(() => {
    //   this.consultarKits();
    //   this.consultarDescuentos();
    // });
  }

  async eliminarKit(idKit) {
    var respuesta = await this.inventarioService.eliminarKit(idKit);
    console.log(respuesta);
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
    this.dataSource.data = [];
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
