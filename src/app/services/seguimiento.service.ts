import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SeguimientoService {
  constructor(private http: HttpClient) {}

  provinciasParaSeguimiento() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ConsultarProvinciaParaSeguimiento",
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

  cantonesParaSeguimiento(idProvincia: string) {
    const body = new HttpParams()
      .set("IdProvincia", idProvincia)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ConsultarCantonesParaSeguimiento",
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

  parroquiasParaSeguimiento(idCanton: string) {
    const body = new HttpParams()
      .set("IdCanton", idCanton)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ConsultarParroquiaParaSeguimiento",
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

  comunidadesParaSeguimiento(idParroquia: string) {
    const body = new HttpParams()
      .set("IdParroquia", idParroquia)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ConsultarComunidadesParaSeguimiento",
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
