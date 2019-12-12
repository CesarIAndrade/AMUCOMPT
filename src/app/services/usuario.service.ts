import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }
  
  private apiUrl:string = "http://192.168.25.15:90/api/"
  private _headers = new HttpHeaders({'Content-Type':'application/json'});
  private _params = new HttpParams();

  login(_usuario:string,_password:string){

    let _params = new HttpParams({
      fromObject : {
        'UsuarioLogin' : _usuario,
        'Contrasena' : _password
      }
    });

    // return this.http.get<Usuario>(`${this.apiUrl}login/`,{headers:this._headers,params:_params});  
    return this.http.get(`${this.apiUrl}TalentoHumano/ListaUsuariosSistema`,{headers:this._headers});  

                                                // params:this._params,
                                                  // responseType: 'json'
  }

}
