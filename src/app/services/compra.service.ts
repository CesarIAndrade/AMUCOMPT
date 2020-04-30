import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(
    private http: HttpClient
  ) { }

  // private apiUrl = "http://localhost:49962/api/";
  private apiUrl = "http://25.39.0.74:90/api/";

  buscarFechaYPrecio(
    idCabeceraFactura: string,
    idRelacionLogica: string,
    perteneceKit: string,
    fechaExpiracion: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('IdRelacionLogica', idRelacionLogica)
      .set('PerteneceKit', perteneceKit)
      .set('FechaExpiracion', fechaExpiracion)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/BuscarInformacionDeUnDetalle', body.toString(),
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

  modificarCantidadDeProductoEnDetalle(
    idDetalleFactura: string,
    cantidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdDetalleFactura', idDetalleFactura)
      .set('Cantidad', cantidad)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/AumentarDetalleFactura', body.toString(),
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

  consultarDetalleFactura(idCabecera: string, _token: string) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabecera)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/ListaFacturaDetalle', body.toString(),
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



  crearDetalleFactura(
    idCabeceraFactura: string,
    idAsignarProductoLote: string,
    cantidad: string,
    faltante: string,
    _token: string
  ) {
    console.log("ID ASIGNAR PRODUCTO LOTE");
    console.log(idAsignarProductoLote);
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('IdAsignarProductoLote', idAsignarProductoLote)
      .set('Cantidad', cantidad)
      .set('Faltante', faltante)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/IngresoDetalleFactura', body.toString(),
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

  quitarDetalleFactura(
    idDetalleFactura: string,
    idCabeceraFactura: string,
    _token: string) {
    const body = new HttpParams()
      .set('IdDetalleFactura', idDetalleFactura)
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/EliminarDetalleFactura', body.toString(),
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
