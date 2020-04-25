import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PanelAdministracionService {

  constructor(private http: HttpClient) { }

  private apiUrl = "http://25.39.0.74:90/api/";

  crearProvincia(provincia: string, _token: string) {
    const body = new HttpParams()
      .set('Descripcion', provincia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoProvincia', body.toString(),
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

  actualizarProvincia(
    idProvincia: string,
    provincia: string,
    _token: string
  ){
    const body = new HttpParams()
      .set('IdProvincia', idProvincia)
      .set('Descripcion', provincia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarProvincia', body.toString(),
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

  eliminarProvincia(idProvincia: string, _token: string){
    const body = new HttpParams()
      .set('IdProvincia', idProvincia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/EliminarProvincia', body.toString(),
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

  crearCanton(
    idProvincia: string,
    canton: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdProvincia', idProvincia)
      .set('Descripcion', canton)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoCanton', body.toString(),
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

  actualizarCanton(
    idProvincia: string,
    idCanton: string,
    canton: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdProvincia', idProvincia)
      .set('IdCanton', idCanton)
      .set('Descripcion', canton)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarCanton', body.toString(),
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

  eliminarCanton(idCanton: string, _token: string) {
    const body = new HttpParams()
      .set('IdCanton', idCanton)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/EliminarCanton', body.toString(),
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

  crearParroquia(
    idCanton: string,
    parroquia: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCanton', idCanton)
      .set('Descripcion', parroquia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoParroquia', body.toString(),
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

  actualizarParroquia(
    idCanton: string,
    idParroquia: string,
    parroquia: string,
    _token: string
  ){
    const body = new HttpParams()
      .set('IdCanton', idCanton)
      .set('IdParroquia', idParroquia)
      .set('Descripcion', parroquia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarParroquia', body.toString(),
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

  eliminarParroquia(idParroquia: string, _token: string){
    const body = new HttpParams()
      .set('IdParroquia', idParroquia)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/EliminarParroquia', body.toString(),
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

  crearComunidad(
    idParroquia: string,
    comunidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdParroquia', idParroquia)
      .set('Descripcion', comunidad)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoComunidad', body.toString(),
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

  actualizarComunidad(
    idParroquia: string,
    idComunidad: string,
    comunidad: string,
    _token: string
  ){
    const body = new HttpParams()
      .set('IdParroquia', idParroquia)
      .set('IdComunidad', idComunidad)
      .set('Descripcion', comunidad)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarComunidad', body.toString(),
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

  eliminarComunidad(idComunidad: string, _token: string){
    const body = new HttpParams()
      .set('IdComunidad', idComunidad)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/EliminarComunidad', body.toString(),
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

  crearSembrio(
    idComunidad: string,
    sembrio: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdComunidad', idComunidad)
      .set('Descripcion', sembrio)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/IngresoSembrio', body.toString(),
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

  actualizarSembrio(
    idComunidad: string,
    idSembrio: string,
    sembrio: string,
    _token: string
  ){
    const body = new HttpParams()
      .set('IdComunidad', idComunidad)
      .set('IdSembrio', idSembrio)
      .set('Descripcion', sembrio)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ActualizarSembrio', body.toString(),
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

  eliminarSembrio(idSembrio: string, _token: string){
    const body = new HttpParams()
      .set('IdSembrio', idSembrio)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/EliminarSembrio', body.toString(),
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
