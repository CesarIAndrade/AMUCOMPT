import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrivilegiosService {

  constructor(private http: HttpClient) { }

  private apiUrl:string = "http://192.168.25.15:90/api/";

  consultarPrivilegios(_token: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + `TalentoHumano/ListaPrivilegio/${_token}`,
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
