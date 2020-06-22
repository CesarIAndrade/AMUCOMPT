import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class PersonaService {
  constructor(private http: HttpClient) {}

  refresh$ = new EventEmitter();

  consultarPersonas() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
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
      localStorage.getItem("token")
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
      localStorage.getItem("token")
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
      localStorage.getItem("token")
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
    segundoNombre: string,
    numeroTelefono1: string,
    tipoTelefono1: string,
    numeroTelefono2: string,
    tipoTelefono2: string,
    correo: string,
    parroquia: string,
    referencia: string
  ) {
    const body = new HttpParams()
      .set("NumeroDocumento", String(numeroDocumento))
      .set("IdTipoDocumento", tipoDocumento)
      .set("ApellidoPaterno", apellidoPaterno)
      .set("ApellidoMaterno", apellidoMaterno)
      .set("PrimerNombre", primerNombre)
      .set("SegundoNombre", segundoNombre)
      .set("AsignacionPersonaComunidad.Parroquia.IdParroquia", parroquia)
      .set("AsignacionPersonaComunidad.Referencia", referencia)
      .set("Telefono1", String(numeroTelefono1))
      .set("Telefono2", String(numeroTelefono2))
      .set("IdTipoTelefono1", tipoTelefono1)
      .set("IdTipoTelefono2", tipoTelefono2)
      .set("Correo", correo)
      .set("encriptada", localStorage.getItem("token"));
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

  consultarPersonaPorId(idPersona: string) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("encriptada", localStorage.getItem("token"));
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
    segundoNombre: string,
    idTelefono1: string,
    numeroTelefono1: string,
    tipoTelefono1: string,
    idTelefono2: string,
    numeroTelefono2: string,
    tipoTelefono2: string,
    correo: string,
    parroquia: string,
    referencia: string
  ) {
    const body = new HttpParams()
      .set("IdPersona", idPersona)
      .set("NumeroDocumento", String(numeroDocumento))
      .set("ApellidoPaterno", apellidoPaterno)
      .set("ApellidoMaterno", apellidoMaterno)
      .set("PrimerNombre", primerNombre)
      .set("SegundoNombre", segundoNombre)
      .set("IdTipoDocumento", tipoDocumento)
      .set("AsignacionPersonaComunidad.Parroquia.IdParroquia", parroquia)
      .set("AsignacionPersonaComunidad.Referencia", referencia)
      .set("IdTelefono1", idTelefono1)
      .set("IdTelefono2", idTelefono2)
      .set("Telefono1", String(numeroTelefono1))
      .set("Telefono2", String(numeroTelefono2))
      .set("IdTipoTelefono1", tipoTelefono1)
      .set("IdTipoTelefono2", tipoTelefono2)
      .set("Correo", correo)
      .set("encriptada", localStorage.getItem("token"));
    console.log(body);
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
}
