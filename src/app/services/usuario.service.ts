import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string, _token: string) {
    const body = new HttpParams()
      .set("usuario", usuario)
      .set("contrasena", contrasena)
      .set("token", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/Login/", body.toString(), {
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

  consultarUsuarios(_token: string) {
    const body = new HttpParams().set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaUsuariosSistema", body.toString(), {
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

  moduloDeUnTipoDeUsuario(idTipoUsuario: string, _token: string) {
    const body = new HttpParams()
      .set("IdTipoUsuario", idTipoUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Usuarios/ListaModulosDeUnTipoUsuario",
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

  privilegiosDeUnModuloTipo(idModuloTipo: string, _token: string) {
    const body = new HttpParams()
      .set("IdModuloTipo", idModuloTipo)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ListaPrivilegioDeUnTipoDeModulo",
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

  consultarTipoUsuario(_token: string) {
    const body = new HttpParams().set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Usuario/ListaTipoUsuario", body.toString(), {
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

  consultarAsignacionTipoUsuario(idUsuario: string, _token: string) {
    const body = new HttpParams()
      .set("IdUsuario", idUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "Usuarios/ObtenerTipoUsuarioDeUnUsuario",
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

  consultarPrivilegios(_token: string) {
    const body = new HttpParams().set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaPrivilegio/", body.toString(), {
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

  consultarModulos(_token: string) {
    const body = new HttpParams().set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Usuarios/ListaModulos/", body.toString(), {
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

  crearUsuario(datosUsuario) {
    const body = new HttpParams()
      .set("IdPersona", datosUsuario.idPersona)
      .set("UsuarioLogin", datosUsuario.usuario)
      .set("Contrasena", datosUsuario.contrasena)
      .set("encriptada", datosUsuario.token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoCredencial", body.toString(), {
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

  habilitarUsuario(idUsuario: string, _token: string) {
    const body = new HttpParams()
      .set("IdUsuario", idUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "Usuario/HabilitarUsuario", body.toString(), {
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

  asignacionTipoUsuario(
    idUsuario: string,
    tipoUsuario: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdUsuario", idUsuario)
      .set("IdTipoUsuario", tipoUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoTipoUsuario", body.toString(), {
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

  modificarAsignacionTipoUsuario(
    idAsignacionTU: string,
    idUsuario: string,
    idTipoUsuario: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdAsignacionTU", idAsignacionTU)
      .set("IdUsuario", idUsuario)
      .set("IdTipoUsuario", idTipoUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ActualizarAsignacionTipoUsuario",
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

  eliminarAsignacionTipoUsuario(
    idAsignacionTipoUsuario: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdAsignacionTU", idAsignacionTipoUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/EliminarAsignacionTipoUsuario",
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

  eliminarUsuario(idUsuario: string, _token: string) {
    const body = new HttpParams()
      .set("IdUsuario", idUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/EliminarCredencial", body.toString(), {
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

  actualizarUsuario(
    IdUsuario: string,
    IdPersona: string,
    UsuarioLogin: string,
    Contrasena: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set("IdUsuario", IdUsuario)
      .set("IdPersona", IdPersona)
      .set("UsuarioLogin", UsuarioLogin)
      .set("Contrasena", Contrasena)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarCredencial", body.toString(), {
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

  consultarTecnicos(idTipoUsuario: string, _token: string) {
    const body = new HttpParams()
      .set("IdTipoUsuario", idTipoUsuario)
      .set("encriptada", _token);
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ConsultarPersonasDependeDeTipoUsuario",
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
