import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class InventarioService {
  constructor(private http: HttpClient) {}

  private apiUrl = apiUrl;

  consultarTipoProductos() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaTipoProductos", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearTipoProducto(tipoProducto: string) {
    const body = new HttpParams()
      .set("Descripcion", tipoProducto)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/IngresoTipoProducto", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  eliminarTipoProducto(idTipoProducto: string) {
    const body = new HttpParams()
      .set("IdTipoProducto", idTipoProducto)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/EliminarTipoProducto", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarProductos() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaProductos", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearProducto(nombre: string, descripcion: string, idTipoProducto: string) {
    const body = new HttpParams()
      .set("Nombre", nombre)
      .set("Descripcion", descripcion)
      .set("IdTipoProducto", idTipoProducto)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/IngresoProducto", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  actualizarProducto(
    idProducto: string,
    nombre: string,
    descripcion: string,
    idTipoProducto: string
  ) {
    const body = new HttpParams()
      .set("IdProducto", idProducto)
      .set("Nombre", nombre)
      .set("Descripcion", descripcion)
      .set("IdTipoProducto", idTipoProducto)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ActualizarProducto", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  eliminarProducto(idProducto: string) {
    const body = new HttpParams()
      .set("IdProducto", idProducto)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/EliminarProducto", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarPresentaciones() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaPresentacion", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearPresentacion(presentacion: string) {
    const body = new HttpParams()
      .set("Descripcion", presentacion)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/IngresoPresentacion", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  eliminarPresentacion(idPresentacion: string) {
    const body = new HttpParams()
      .set("IdPresentacion", idPresentacion)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/EliminarPresentacion", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarMedidas() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaMedidas", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearMedida(medida: string) {
    const body = new HttpParams()
      .set("Descripcion", medida)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/IngresoMedida", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  eliminarMedida(idMedida: string) {
    const body = new HttpParams()
      .set("IdMedida", idMedida)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/EliminarMedida", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarConfiguracionProductoTodos() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/ListaConfigurarProductosTodos",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarConfiguracionProducto() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaConfigurarProductos", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearConfiguracionProducto(
    idAsignacionTu: string,
    idProducto: string,
    idMedida: string,
    idPresentacion: string,
    codigo: string,
    cantidadMedida: string,
    iva: string
  ) {
    const body = new HttpParams()
      .set("IdAsignacionTu", idAsignacionTu)
      .set("IdProducto", idProducto)
      .set("IdMedida", idMedida)
      .set("IdPresentacion", idPresentacion)
      .set("Codigo", codigo)
      .set("CantidadMedida", cantidadMedida)
      .set("Iva", iva)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/IngresoConfigurarProducto",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  actualizarConfiguracionProducto(
    idConfigurarProducto: string,
    idAsignacionTu: string,
    idProducto: string,
    idMedida: string,
    idPresentacion: string,
    codigo: string,
    cantidadMedida: string,
    iva: string
  ) {
    const body = new HttpParams()
      .set("IdConfigurarProducto", idConfigurarProducto)
      .set("IdAsignacionTu", idAsignacionTu)
      .set("IdProducto", idProducto)
      .set("IdMedida", idMedida)
      .set("IdPresentacion", idPresentacion)
      .set("Codigo", codigo)
      .set("CantidadMedida", cantidadMedida)
      .set("Iva", iva)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/ActualizarConfigurarProducto",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  eliminarConfiguracionProducto(
    idConfigurarProducto: string,
    idProducto: string
  ) {
    const body = new HttpParams()
      .set("IdConfigurarProducto", idConfigurarProducto)
      .set("IdProducto", idProducto)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/EliminarConfigurarProducto",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarKits() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaKit", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearKit(kit: string, codigo: string) {
    const body = new HttpParams()
      .set("Descripcion", kit)
      .set("Codigo", codigo)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/IngresoKit", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  eliminarKit(idKit: string) {
    const body = new HttpParams()
      .set("IdKit", idKit)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/EliminarKit", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarDescuentos() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaDescuento", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearDescuentoKit(descuento: string) {
    const body = new HttpParams()
      .set("Porcentaje", descuento)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/IngresoDescuento", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  asignarDescuentoKit(idKit: string, idDescuento: string) {
    const body = new HttpParams()
      .set("IdKit", idKit)
      .set("IdDescuento", idDescuento)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/IngresoAsignarDescuentoKit",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarKitsYSusProductos(idKit: string, url: string) {
    const body = new HttpParams()
      .set("IdKit", idKit)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + url, body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarProductosQueNoTieneUnKit(idKit: string) {
    const body = new HttpParams()
      .set("IdKit", idKit)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/ListaConfigurarProductosQueNoTieneUnKit",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  asignarProductoKit(
    idConfigurarProducto: string,
    idAsignarDescuentoKit: string
  ) {
    const body = new HttpParams()
      .set("IdConfigurarProducto", idConfigurarProducto)
      .set("IdAsignarDescuentoKit", idAsignarDescuentoKit)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/IngresoAsignarProductoKit",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  eliminarAsignacionProductoKit(idAsignarProductoKit: string) {
    const body = new HttpParams()
      .set("IdAsignarProductoKit", idAsignarProductoKit)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/EliminarAsignarProductoKit",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarStock() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/ListarStock", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  consultarLotesDeUnProducto(
    idCabeceraFactura: string,
    idRelacionLogica: string,
    perteneceKit: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdRelacionLogica", idRelacionLogica)
      .set("PerteneceKit", perteneceKit)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/ListaLote", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearLote(codigo: string, capacidad: string, fechaExpiracion: string) {
    const body = new HttpParams()
      .set("Codigo", codigo)
      .set("Capacidad", capacidad)
      .set("FechaExpiracion", fechaExpiracion)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/IngresoLote", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  asignarProductoLote(
    idCabeceraFactura: string,
    cantidad: string,
    idRelacionLogica: string,
    perteneceKit: string,
    precio: string,
    idLote?: string,
    fechaExpiracion?: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("Cantidad", cantidad)
      .set("IdRelacionLogica", idRelacionLogica)
      .set("PerteneceKit", perteneceKit)
      .set("ValorUnitario", precio)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"))
      .set("IdLote", idLote)
      .set("FechaExpiracion", fechaExpiracion);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/IngresoAsignarProductoLote", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  buscarPrecioDeUnProducto(IdAsignarProductoLote: string) {
    const body = new HttpParams()
      .set("IdAsignarProductoLote", IdAsignarProductoLote)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/BuscarPrecioConfigurarProducto",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  buscarLote(lote: string, idRelacionLogica: string, perteneceKit: string) {
    const body = new HttpParams()
      .set("Codigo", lote)
      .set("AsignarProductoLote.IdRelacionLogica", idRelacionLogica)
      .set("AsignarProductoLote.PerteneceKit", perteneceKit)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/BuscarLote", body.toString(), {
          headers: new HttpHeaders().set(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
        })
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  crearPrecio(idConfigurarProducto: string, precio: string) {
    const body = new HttpParams()
      .set("IdConfigurarProducto", idConfigurarProducto)
      .set("Precio", precio)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/IngresoPrecioConfigurarProducto",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  actualizarPrecio(
    idPrecio: string,
    idConfigurarProducto: string,
    precio: string
  ) {
    const body = new HttpParams()
      .set("IdPrecio", idPrecio)
      .set("IdConfigurarProducto", idConfigurarProducto)
      .set("Precio", precio)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Inventario/ActualizarPrecioConfigurarProducto",
          body.toString(),
          {
            headers: new HttpHeaders().set(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
          }
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
}
