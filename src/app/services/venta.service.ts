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
    descuento: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdAsignarProductoLote", idAsignarProductoLote)
      .set("AplicaDescuento", aplicaDescuento)
      .set("Faltante", faltante)
      .set("Cantidad", cantidad)
      .set("PorcentajeDescuento", descuento)
      .set("encriptada", _token);
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

  consultarDetalleFactura(IdCabeceraFactura: string, _token: string) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", IdCabeceraFactura)
      .set("encriptada", _token);
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

  consultarFacturasVentasFinalizadas(_token: string) {
    const body = new HttpParams().set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Factura/ListaFacturasFinalizadasVenta",
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

  crearConfiguracionVenta(
    idCabeceraFactura: string,
    idPersona: string,
    efectivo: string,
    fechaFinalCredito: string,
    aplicaSeguro: string,
    valorSeguro: string,
    seguroCancelado: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdPersona", idPersona)
      .set("Efectivo", efectivo)
      .set("FechaFinalCredito", fechaFinalCredito)
      .set("AplicaSeguro", aplicaSeguro)
      .set("ValorSeguro", valorSeguro)
      .set("SeguroCancelado", seguroCancelado)
      .set("encriptada", _token);
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
    Cantidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdDetalleVenta", IdDetalleVenta)
      .set("Cantidad", Cantidad)
      .set("encriptada", _token);
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

  quitarDetalleFactura(idDetalleVenta: string, _token: string) {
    const body = new HttpParams()
      .set("IdDetalleVenta", idDetalleVenta)
      .set("encriptada", _token);
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
    cantidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdKit", idKit)
      .set("Cantidad", cantidad)
      .set("encriptada", _token);
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
    idKit: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdKit", idKit)
      .set("encriptada", _token);
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
    idComunidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdComunidad", idComunidad)
      .set("encriptada", _token);
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
    idAsignarComunidadFactura: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdAsignarComunidadFactura", idAsignarComunidadFactura)
      .set("encriptada", _token);
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

  listarComunidadesPorFactura(idCabeceraFactura: string, _token: string) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("encriptada", _token);
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

  filtroClientes(
    url: string,
    idLocalidad: string,
    identificador: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set(identificador, idLocalidad)
      .set("encriptada", _token);
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

  asignarClienteTecnico(idTecnico: string, idPersona: string, _token: string) {
    const body = new HttpParams()
      .set("IdAsignarTUTecnico", idTecnico)
      .set("IdPersona", idPersona)
      .set("encriptada", _token)
    console.log(body);
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
}
