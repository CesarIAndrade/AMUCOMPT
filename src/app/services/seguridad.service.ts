import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private http: HttpClient) { }

  // private apiUrl:string = "http://192.168.25.15:90/api/";
  private apiUrl: string = "http://192.168.1.20:9120/api/";

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
