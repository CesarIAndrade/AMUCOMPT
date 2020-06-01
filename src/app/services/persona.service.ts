import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class PersonaService {
  constructor(private http: HttpClient) {}

  consultarPersonas() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ListaUsuariosClientes/",
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

  consultarPersonasSinUsuario() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ConsultarPersonasSinUsuario",
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

  consultarTipoDocumento() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ConsultarTipoDocumento/",
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

  consultarTipoTelefono() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("miCuenta.getToken")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaTipoTelefono/", body.toString(), {
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

  crearPersona(
    numeroDocumento: string,
    tipoDocumento: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    primerNombre: string,
    segundoNombre: string
  ) {
    const body = new HttpParams()
      .set("NumeroDocumento", numeroDocumento)
      .set("IdTipoDocumento", tipoDocumento)
      .set("ApellidoPaterno", apellidoPaterno)
      .set("ApellidoMaterno", apellidoMaterno)
      .set("PrimerNombre", primerNombre)
      .set("SegundoNombre", segundoNombre)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoPersona", body.toString(), {
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

  crearTelefono(idPersona: string, numero: string, tipoTelefono: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("Numero", numero)
      .set("IdTipoTelefono", tipoTelefono)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoTelefono", body.toString(), {
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

  crearCorreo(idPersona: string, correo: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("CorreoValor", correo)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoCorreo", body.toString(), {
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

  crearDireccion(idPersona: string, parroquia: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("IdParroquia", parroquia)
      .set("encriptada", localStorage.getItem("miCuenta.postToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/IngresoAsignacionPersonaParroquia",
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

  eliminarPersona(idPersona: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("encriptada", localStorage.getItem("miCuenta.deleteToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/EliminarPersona", body.toString(), {
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

  consultarPersonaPorId(idPersona: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("encriptada", localStorage.getItem("miCuenta.getToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/BuscarPersona", body.toString(), {
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

  actualizarPersona(
    idPersona: string,
    numeroDocumento: string,
    tipoDocumento: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    primerNombre: string,
    segundoNombre: string
  ) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("NumeroDocumento", numeroDocumento)
      .set("ApellidoPaterno", apellidoPaterno)
      .set("ApellidoMaterno", apellidoMaterno)
      .set("PrimerNombre", primerNombre)
      .set("SegundoNombre", segundoNombre)
      .set("IdTipoDocumento", tipoDocumento)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarPersona", body.toString(), {
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

  actualizarTelefono(
    idPersona: string,
    idTelefono: string,
    numero: string,
    tipoTelefono: string
  ) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("IdTelefono", idTelefono)
      .set("Numero", numero)
      .set("IdTipoTelefono", tipoTelefono)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarTelefono", body.toString(), {
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

  actualizarCorreo(idPersona: string, idCorreo: string, correoValor: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("IdCorreo", idCorreo)
      .set("CorreoValor", correoValor)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarCorreo", body.toString(), {
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

  actualizarDireccion(
    idPersona: string,
    idAsignacionPC: string,
    parroquia: string
  ) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("IdAsignacionPC", idAsignacionPC)
      .set("IdParroquia", parroquia)
      .set("encriptada", localStorage.getItem("miCuenta.putToken"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ActualizarAsignacionPersonaParroquia",
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
