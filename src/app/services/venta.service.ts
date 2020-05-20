import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class VentaService {
  constructor(private http: HttpClient) {}

  crearDetalleFactura(
    IdCabeceraFactura: string,
    IdAsignarProductoLote: string,
    AplicaDescuento: string,
    Faltante: string,
    Cantidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", IdCabeceraFactura)
      .set("IdAsignarProductoLote", IdAsignarProductoLote)
      .set("AplicaDescuento", AplicaDescuento)
      .set("Faltante", Faltante)
      .set("Cantidad", Cantidad)
      .set("encriptada", _token)
    console.log(body);
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
    IdPersona: string,
    IdSembrio: string,
    Efectivo: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdPersona", IdPersona)
      .set("IdSembrio", IdSembrio)
      .set("Efectivo", Efectivo)
      .set("encriptada", _token)
    console.log(body);
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

}
