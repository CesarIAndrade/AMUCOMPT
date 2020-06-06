import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class CompraService {
  constructor(private http: HttpClient) {}

  buscarFechaYPrecio(
    idCabeceraFactura: string,
    idRelacionLogica: string,
    perteneceKit: string,
    fechaExpiracion: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdRelacionLogica", idRelacionLogica)
      .set("PerteneceKit", perteneceKit)
      .set("FechaExpiracion", fechaExpiracion)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Factura/BuscarInformacionDeUnDetalle",
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

  modificarCantidadDeProductoEnDetalle(
    idDetalleFactura: string,
    cantidad: string
  ) {
    const body = new HttpParams()
      .set("IdDetalleFactura", idDetalleFactura)
      .set("Cantidad", cantidad)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/AumentarDetalleFactura", body.toString(), {
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

  consultarDetalleFactura(idCabecera: string) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabecera)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/ListaFacturaDetalle", body.toString(), {
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

  crearDetalleFactura(
    idCabeceraFactura: string,
    idAsignarProductoLote: string,
    cantidad: string,
    faltante: string
  ) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("IdAsignarProductoLote", idAsignarProductoLote)
      .set("Cantidad", cantidad)
      .set("Faltante", faltante)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/IngresoDetalleFactura", body.toString(), {
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

  quitarDetalleFactura(idDetalleFactura: string, idCabeceraFactura: string) {
    const body = new HttpParams()
      .set("IdDetalleFactura", idDetalleFactura)
      .set("IdCabeceraFactura", idCabeceraFactura)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/EliminarDetalleFactura", body.toString(), {
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
