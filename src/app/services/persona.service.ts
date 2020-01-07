import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = "http://192.168.25.15:90/api/";

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

  consultarTipoTelefono(_token: string){
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

  consultarProvincias(_token: string){
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

  consultarCantones(_token: string){
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

  consultarParroquias(_token: string){
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

  consultarComunidades(_token: string){
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

  consultarCantonesDeUnaProvincia(idProvincia: string, _token: string){
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

  consultarParroquiasDeUnCanton(idCanton: string, _token: string){
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

  consultarComunidadesDeUnaParroquia(idParroquia: string, _token: string){
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
    apellidoPaterno: string,
    apellidoMaterno: string,
    primerNombre: string,
    segundoNombre: string,
    idTipoDocumento: string,
    _token: string
  ) {
    const body = new HttpParams()
    .set('NumeroDocumento', numeroDocumento)
    .set('ApellidoPaterno', apellidoPaterno)
    .set('ApellidoMaterno', apellidoMaterno)
    .set('PrimerNombre', primerNombre)
    .set('SegundoNombre', segundoNombre)
    .set('IdTipoDocumento', idTipoDocumento)
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
    idTipoTelefono: string,	
    _token: string  
  ){
    const body = new HttpParams()
    .set('IdPersona', idPersona)
    .set('Numero', numero)
    .set('IdTipoTelefono', idTipoTelefono)
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
    correoValor: string,
    _token: string
  ){
    const body = new HttpParams()
    .set('IdPersona', idPersona)
    .set('CorreoValor', correoValor)
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
    idComunidad: string,	
    _token: string,
  ){
    const body = new HttpParams()
    .set('IdPersona', idPersona)
    .set('IdComunidad', idComunidad)
    .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoAsignacionPersonaComunidad', body.toString(),
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
  ){
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
}
