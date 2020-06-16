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

  filtroClientesEnAsignacion(
    url: string,
    idLocalidad: string,
    identificador: string
  ) {
    const body = new HttpParams()
      .set(identificador, idLocalidad)
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

  filtroClientesEnVisitas(idTecnico: string) {
    const body = new HttpParams()
      .set("IdAsignarTUTecnico", idTecnico)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/ConsultarPersonasAsignadasAunTecnicoPorComunidad",
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

  listarClientesTecnico(url: string, identificador: string, idTecnico: string) {
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

  registrarVisita(idComunidad: string, idTecnico: string, observacion: string) {
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

  actualizarVisita(idVisita: string, idTecnico: string, observacion: string) {
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

  eliminarVisita(idVisita: string) {
    const body = new HttpParams()
      .set("IdVisita", idVisita)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
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

  consultarFacturasCliente(numeroDocumento: string) {
    const body = new HttpParams()
      .set("NumeroDocumento", numeroDocumento)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/ConsultarFacturasPendientesPorPersona",
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

  terminarAsistencia(idTecnico: string) {
    const body = new HttpParams()
      .set("IdAsignarTecnicoPersonaComunidad", idTecnico)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/FinalizarAsignarTecnicoPersonaComunidad",
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

  consultarVisitasFinalizadas(idTecnico: string) {
    const body = new HttpParams()
      .set("IdAsignarTUTecnico", idTecnico)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Credito/ConsultarVisitasFinalizadasPorTecnico",
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
