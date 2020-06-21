import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class PanelAdministracionService {
  constructor(private http: HttpClient) {}

  refresh$ = new EventEmitter();

  crearProvincia(provincia: string) {
    const body = new HttpParams()
      .set("Descripcion", provincia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoProvincia", body.toString(), {
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

  actualizarProvincia(idProvincia: string, provincia: string) {
    const body = new HttpParams()
      .set("IdProvincia", idProvincia)
      .set("Descripcion", provincia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarProvincia", body.toString(), {
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

  eliminarProvincia(idProvincia: string) {
    const body = new HttpParams()
      .set("IdProvincia", idProvincia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/EliminarProvincia", body.toString(), {
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

  crearCanton(idProvincia: string, canton: string) {
    const body = new HttpParams()
      .set("IdProvincia", idProvincia)
      .set("Descripcion", canton)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoCanton", body.toString(), {
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

  actualizarCanton(idProvincia: string, idCanton: string, canton: string) {
    const body = new HttpParams()
      .set("IdProvincia", idProvincia)
      .set("IdCanton", idCanton)
      .set("Descripcion", canton)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarCanton", body.toString(), {
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

  eliminarCanton(idCanton: string) {
    const body = new HttpParams()
      .set("IdCanton", idCanton)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/EliminarCanton", body.toString(), {
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

  crearParroquia(idCanton: string, parroquia: string) {
    const body = new HttpParams()
      .set("IdCanton", idCanton)
      .set("Descripcion", parroquia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoParroquia", body.toString(), {
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

  actualizarParroquia(
    idCanton: string,
    idParroquia: string,
    parroquia: string
  ) {
    const body = new HttpParams()
      .set("IdCanton", idCanton)
      .set("IdParroquia", idParroquia)
      .set("Descripcion", parroquia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarParroquia", body.toString(), {
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

  eliminarParroquia(idParroquia: string) {
    const body = new HttpParams()
      .set("IdParroquia", idParroquia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/EliminarParroquia", body.toString(), {
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

  crearComunidad(idParroquia: string, comunidad: string) {
    const body = new HttpParams()
      .set("IdParroquia", idParroquia)
      .set("Descripcion", comunidad)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/IngresoComunidad", body.toString(), {
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

  actualizarComunidad(
    idParroquia: string,
    idComunidad: string,
    comunidad: string
  ) {
    const body = new HttpParams()
      .set("IdParroquia", idParroquia)
      .set("IdComunidad", idComunidad)
      .set("Descripcion", comunidad)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ActualizarComunidad", body.toString(), {
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

  eliminarComunidad(idComunidad: string) {
    const body = new HttpParams()
      .set("IdComunidad", idComunidad)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/EliminarComunidad", body.toString(), {
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

  consultarProvincias() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaProvincia/", body.toString(), {
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

  consultarCantones() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaCantones/", body.toString(), {
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

  consultarParroquias() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaParroquia/", body.toString(), {
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

  consultarComunidades() {
    const body = new HttpParams().set(
      "encriptada",
      localStorage.getItem("token")
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaComunidad/", body.toString(), {
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

  consultarCantonesDeUnaProvincia(idProvincia: string) {
    const body = new HttpParams()
      .set("IdProvincia", idProvincia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ListaCantonesProvincia/",
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

  consultarParroquiasDeUnCanton(idCanton: string) {
    const body = new HttpParams()
      .set("IdCanton", idCanton)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(apiUrl + "TalentoHumano/ListaParroquiaCanton", body.toString(), {
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

  consultarComunidadesDeUnaParroquia(idParroquia: string) {
    const body = new HttpParams()
      .set("IdParroquia", idParroquia)
      .set("encriptada", localStorage.getItem("token"));
    return new Promise((resolve, reject) => {
      this.http
        .post(
          apiUrl + "TalentoHumano/ListaComunidadParroquia/",
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
