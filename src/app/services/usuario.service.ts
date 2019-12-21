import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = "http://192.168.25.15:90/api/"

  login(_usuario: string, _password: string, _token: string) {

    const body = new HttpParams()
      .set('usuario', _usuario)
      .set('contrasena', _password)
      .set('token', _token)

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/Login/', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  consultarUsuarios(_token: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + `TalentoHumano/ListaUsuariosSistema/${_token}`,
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
  
  consultarPrivilegios(_token: string) {
    const body = new HttpParams()
    .set('encriptada', _token)

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaPrivilegio/',
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
}
