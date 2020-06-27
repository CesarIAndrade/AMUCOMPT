import { Injectable, EventEmitter} from "@angular/core";
import { apiUrl } from "../../environments/environment";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class RubrosService {
  constructor(private http: HttpClient) {}

  idTicket: string;
  refresh$ = new EventEmitter();

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
    idPersona: string,
    identificador: string,
    peso?: string,
    porcentajeHumedad?: string,
    precioPorQuintal?: string,
    porcentajeImpureza?: string,
  ) {
    const body = new HttpParams()
      .set("_TipoPresentacionRubro.IdTipoPresentacionRubro", presentacionRubro)
      .set("_TipoPresentacionRubro.Identificador", identificadorPresentacion)
      .set("_TipoRubro.IdTipoRubro", rubro)
      .set("_Vehiculo.Placa", placa)
      .set("IdAsignarTU", idAdministrador)
      .set("IdPersona", idPersona)
      .set(identificador, peso)
      .set("PorcentajeHumedad", porcentajeHumedad)
      .set("PrecioPorQuintal", precioPorQuintal)
      .set("PorcentajeImpureza", porcentajeImpureza)
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

  eliminarTicket(idTicket: string) {
    const body = new HttpParams()
      .set("IdTicket", idTicket)
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

  finalizarTicket(
    idTicket: string,
    pesoTara: string,
    porcentajeHumedad: string,
    precioPorQuintal: string,
    porcentajeImpureza: string,
  ) {
    const body = new HttpParams()
      .set("IdTicket", idTicket)
      .set("PesoTara", pesoTara)
      .set("PorcentajeHumedad", porcentajeHumedad)
      .set("PrecioPorQuintal", precioPorQuintal)
      .set("PorcentajeImpureza", porcentajeImpureza)
      .set("encriptada", localStorage.getItem("token"));
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Rubros/FinalizarTicket", body.toString(), {
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
