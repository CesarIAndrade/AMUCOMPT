import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private http: HttpClient) { }

  private apiUrl = "http://25.70.109.48:90/api/";

  consultarTokens(){
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Seguridad/ConsultarClave',
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
