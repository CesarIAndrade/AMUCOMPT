import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class VentaService {
  constructor(private http: HttpClient) {}

  crearDetalleFactura(
    idCabeceraFactura: string,
    idAsignarProductoLote: string,
    aplicaDescuento: string,
    faltante: string,
    cantidad: string,
    descuento: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdAsignarProductoLote", idAsignarProductoLote)
      .set("AplicaDescuento", aplicaDescuento)
      .set("Faltante", faltante)
      .set("Cantidad", cantidad)
      .set("PorcentajeDescuento", descuento)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/IngresoDetalleVenta", body.toString(), {
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

  consultarDetalleFactura(IdCabeceraFactura: string) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", IdCabeceraFactura)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/ListaFacturaVenta", body.toString(), {
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

  crearConfiguracionVenta(
    idCabeceraFactura: string,
    idPersona: string,
    efectivo: string,
    fechaFinalCredito: string,
    aplicaSeguro: string,
    valorSeguro: string,
    seguroCancelado: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdPersona", idPersona)
      .set("Efectivo", efectivo)
      .set("FechaFinalCredito", fechaFinalCredito)
      .set("AplicaSeguro", aplicaSeguro)
      .set("ValorSeguro", valorSeguro)
      .set("SeguroCancelado", seguroCancelado)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/IngresoConfigurarVenta", body.toString(), {
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

  modificarCantidadDeProductoEnDetalleVenta(
    IdDetalleVenta: string,
    Cantidad: string
  ) {
    const body = new HttpParams()
      .set("IdDetalleVenta", IdDetalleVenta)
      .set("Cantidad", Cantidad)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/AumentarDetalleVenta", body.toString(), {
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

  quitarDetalleFactura(idDetalleVenta: string) {
    const body = new HttpParams()
      .set("IdDetalleVenta", idDetalleVenta)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/EliminarDetalleVenta", body.toString(), {
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

  ingresoDetalleVentaPorKit(
    idCabeceraFactura: string,
    idKit: string,
    cantidad: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdKit", idKit)
      .set("Cantidad", cantidad)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/IngresoDetalleVentaPorKit", body.toString(), {
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

  quitarDetalleVentaPorKit(
    idCabeceraFactura: string,
    idKit: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdKit", idKit)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/EliminarDetalleVentaPorKitCompleto",
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

  asignarComunidadFactura(
    idCabeceraFactura: string,
    idComunidad: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdComunidad", idComunidad)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/IngresoAsignarComunidadFactura",
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

  quitarAsignacionComunidadFactura(
    idAsignarComunidadFactura: string
  ) {
    const body = new HttpParams()
      .set("IdAsignarComunidadFactura", idAsignarComunidadFactura)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/EliminarAsignarComunidadFactura",
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

  listarComunidadesPorFactura(idCabeceraFactura: string) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/ListaAsignarComunidadFacturaPorFactura",
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

  filtroClientesEnAsignacion(
    url: string,
    idLocalidad: string,
    identificador: string
  ) {
    const body = new HttpParams()
      .set(identificador, idLocalidad)
      .set("encriptada",  localStorage.getItem("miCuenta.getToken"));
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

  filtroClientesEnVisitas(
    idTecnico: string
  ) {
    const body = new HttpParams()
      .set("IdAsignarTUTecnico", idTecnico)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"))
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/ConsultarPersonasAsignadasAunTecnicoPorComunidad", body.toString(), {
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

  asignarClienteTecnico(idTecnico: string, idPersona: string) {
    const body = new HttpParams()
      .set("IdAsignarTUTecnico", idTecnico)
      .set("IdPersona", idPersona)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/IngresoAsignarTecnicoPersonaComunidad",
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

  desaignarClienteTecnico(idPersona: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/EliminarAsignarTecnicoPersonaComunidad",
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

  listarClientesTecnico(
    url: string,
    identificador: string,
    idTecnico: string,
  ) {
    const body = new HttpParams()
      .set(identificador, idTecnico)
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

  visitasClienteComunidad(idComunidad: string) {
    const body = new HttpParams()
      .set("IdAsignarTecnicoPersonaComunidad", idComunidad)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/ConsutlarVisita", body.toString(), {
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

  registrarVisita(
    idComunidad: string,
    idTecnico: string,
    observacion: string
  ) {
    const body = new HttpParams()
      .set("IdAsignarTecnicoPersonaComunidad", idComunidad)
      .set("IdAsignarTU", idTecnico)
      .set("Observacion", observacion)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/IngresoVisita", body.toString(), {
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

  actualizarVisita(
    idVisita: string,
    idTecnico: string,
    observacion: string
  ) {
    const body = new HttpParams()
      .set("IdVisita", idVisita)
      .set("IdAsignarTU", idTecnico)
      .set("Observacion", observacion)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/ModificarVisita", body.toString(), {
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

  eliminarVisita(
    idVisita: string
  ) {
    const body = new HttpParams()
      .set("IdVisita", idVisita)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"))
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Credito/EliminarVisita", body.toString(), {
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
}
