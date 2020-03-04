import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }

  //private apiUrl = "http://192.168.25.20:90/api/";
  private apiUrl = "http://25.39.0.74/api/";

  consultarPersonas(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaUsuariosClientes/', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarPersonasSinUsuario(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ConsultarPersonasSinUsuario', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }


  consultarTipoDocumento(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ConsultarTipoDocumento/',
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    });
  }

  consultarTipoTelefono(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaTipoTelefono/',
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    });
  }

  consultarProvincias(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaProvincia/',
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarCantones(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaCantones/',
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarParroquias(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaParroquia/',
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarComunidades(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaComunidad/',
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarSembrios(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaSembrios', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    });
  }

  consultarCantonesDeUnaProvincia(idProvincia: string, _token: string) {
    const body = new HttpParams()
      .set('IdProvincia', idProvincia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaCantonesProvincia/', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarParroquiasDeUnCanton(idCanton: string, _token: string) {
    const body = new HttpParams()
      .set('IdCanton', idCanton)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaParroquiaCanton', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarComunidadesDeUnaParroquia(idParroquia: string, _token: string) {
    const body = new HttpParams()
      .set('IdParroquia', idParroquia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaComunidadParroquia/', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  crearPersona(
    numeroDocumento: string,
    tipoDocumento: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    primerNombre: string,
    segundoNombre: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('NumeroDocumento', numeroDocumento)
      .set('IdTipoDocumento', tipoDocumento)
      .set('ApellidoPaterno', apellidoPaterno)
      .set('ApellidoMaterno', apellidoMaterno)
      .set('PrimerNombre', primerNombre)
      .set('SegundoNombre', segundoNombre)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoPersona', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  crearTelefono(
    idPersona: string,
    numero: string,
    tipoTelefono: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('Numero', numero)
      .set('IdTipoTelefono', tipoTelefono)
      .set('encriptada', _token)

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoTelefono', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  crearCorreo(
    idPersona: string,
    correo: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('CorreoValor', correo)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoCorreo', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  crearDireccion(
    idPersona: string,
    parroquia: string,
    _token: string,
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('IdParroquia', parroquia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoAsignacionPersonaParroquia', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  eliminarPersona(
    idPersona: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/EliminarPersona', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  consultarPersonaPorId(
    idPersona: string,
    _token: string) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/BuscarPersona', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  actualizarPersona(
    idPersona: string,
    numeroDocumento: string,
    tipoDocumento: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    primerNombre: string,
    segundoNombre: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('NumeroDocumento', numeroDocumento)
      .set('ApellidoPaterno', apellidoPaterno)
      .set('ApellidoMaterno', apellidoMaterno)
      .set('PrimerNombre', primerNombre)
      .set('SegundoNombre', segundoNombre)
      .set('IdTipoDocumento', tipoDocumento)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarPersona', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  actualizarTelefono(
    idPersona: string,
    idTelefono: string,
    numero: string,
    tipoTelefono: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('IdTelefono', idTelefono)
      .set('Numero', numero)
      .set('IdTipoTelefono', tipoTelefono)
      .set('encriptada', _token)

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarTelefono', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  actualizarCorreo(
    idPersona: string,
    idCorreo: string,
    correoValor: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('IdCorreo', idCorreo)
      .set('CorreoValor', correoValor)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarCorreo', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }

  actualizarDireccion(
    idPersona: string,
    idAsignacionPC: string,
    parroquia: string,
    _token: string,
  ) {
    const body = new HttpParams()
      .set('IdPersona', idPersona)
      .set('IdAsignacionPC', idAsignacionPC)
      .set('IdParroquia', parroquia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarAsignacionPersonaParroquia', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    })
  }
}
