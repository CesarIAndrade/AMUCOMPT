import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Interfaces
import { PersonasResult } from "../interfaces/persona/personas-result";

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

  consultatTipoDocumentos(_token: string) {
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

  crearPersona() {

  }
}
