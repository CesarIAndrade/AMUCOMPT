import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UsuarioResult } from '../interfaces/usuario/usuario-result';
import { UsuariosResult } from '../interfaces/usuario/usuarios-result';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }
  
  private apiUrl:string = "http://192.168.25.15:90/api/"
  private _headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
  private _params = new HttpParams();

  login(_usuario:string,_password:string, _token:string){
    let _params = new HttpParams({
      fromObject : {
        'UsuarioLogin' : _usuario,
        'Contrasena' : _password
      }
    });
    // return this.http.get<Usuario>(`${this.apiUrl}login/`,{headers:this._headers,params:_params});  
    return this.http.post<UsuarioResult>(`${this.apiUrl}TalentoHumano/Login/${_usuario}/${_password}/${_token}`,{headers:this._headers});  
  }

  consultarUsuarios(){
    return this.http.get<UsuariosResult>(`${this.apiUrl}TalentoHumano/ListaUsuariosSistema`)
  }

}
