import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class FacturaService {
  constructor(private http: HttpClient) {}

  consultarTipoTransaccion() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Inventario/ListaTipoTransaccion", body.toString(), {
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

  crearCabeceraFactura(idAsignacionTU: string, idTipoTransaccion: string) {
    const body = new HttpParams()
      .set("IdAsignacionTU", idAsignacionTU)
      .set("IdTipoTransaccion", idTipoTransaccion)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/IngresoCabeceraFactura", body.toString(), {
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

  finalizarFactura(idCabecera: string, url: string) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabecera)
      .set("encriptada", localStorage.getItem("token"));
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

  consultarFacturas(url: string) {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
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

  eliminarFactura(idCabecera: string) {
    const body = new HttpParams()
      .set("IdCabeceraFactura", idCabecera)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Factura/EliminarFactura", body.toString(), {
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
