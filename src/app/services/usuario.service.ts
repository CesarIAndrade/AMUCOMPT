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


debugger
  login(_usuario: string, _password: string, _token: string){

    const body = new HttpParams()
    .set('usuario', _usuario)
    .set('contrasena', _password)
    .set('token', _token)
  
    return new Promise((resolve, reject) => {
     this.http.post(this.apiUrl+'TalentoHumano/Login/',body.toString(),
        { 
          headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')}
        )
        .subscribe(res => {
            resolve(res);
        }, (err) => {
          reject(err);
      });
  });

  }

  consultarUsuarios(_token: string){
    return this.http.get<UsuariosResult>(`${this.apiUrl}TalentoHumano/ListaUsuariosSistema/${_token}`)
  }

}
