import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private http: HttpClient) { }

  refresh$ = new EventEmitter();

  consultarTokens(){
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Seguridad/ConsultarClave',
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
}
