import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(
    private http: HttpClient
  ) { }

  consultarTipoTransaccion(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Inventario/ListaTipoTransaccion', body.toString(),
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

  crearCabeceraFactura(
    idAsignacionTU: string,
    idTipoTransaccion: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdAsignacionTU', idAsignacionTU)
      .set('IdTipoTransaccion', idTipoTransaccion)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Factura/IngresoCabeceraFactura', body.toString(),
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

  consultarFacturasNoFinalizadas(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Factura/ListaFacturasNoFinalizadas', body.toString(),
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

  finalizarFactura(
    idCabecera: string, 
    url: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabecera)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + url, body.toString(),
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
