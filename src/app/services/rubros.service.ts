import { Injectable } from "@angular/core";
import { apiUrl } from "../../environments/environment";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class RubrosService {
  constructor(private http: HttpClient) {}

  consultarRubros() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Rubros/ConsultarTipoRubro", body.toString(), {
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

  consultarPresentacionRubros() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Rubros/ConsultarTipoPresentacionRubro",
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

  consultarPlacas() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Rubros/ConsultarPlacas", body.toString(), {
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

  consultarTickets() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Rubros/ConsultarTicket", body.toString(), {
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

  crearTicket(
    presentacionRubro: string,
    identificadorPresentacion: string,
    rubro: string,
    placa: string,
    idAdministrador: string,
    pesoBruto: string,
    idPersona: string
  ) {
    const body = new HttpParams()
      .set("_TipoPresentacionRubro.IdTipoPresentacionRubro", presentacionRubro)
      .set("_TipoPresentacionRubro.Identificador", identificadorPresentacion)
      .set("_TipoRubro.IdTipoRubro", rubro)
      .set("_Vehiculo.Placa", placa)
      .set("IdAsignarTU", idAdministrador)
      .set("PesoBruto", pesoBruto)
      .set("IdPersona", idPersona)
      .set("encriptada", localStorage.getItem("token"));
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Rubros/IngresarTicket", body.toString(), {
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

  eliminarTicket(idTiket: string) {
    const body = new HttpParams()
      .set("IdTicket", idTiket)
      .set("encriptada", localStorage.getItem("token"));
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Rubros/EliminarTicket", body.toString(), {
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
