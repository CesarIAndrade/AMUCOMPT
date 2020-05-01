import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { apiUrl } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(
    private http: HttpClient
  ) { }

  crearDetalleVenta(
    IdCabeceraFactura: string,
    IdAsignarProductoLote: string,
    AplicaDescuento: string,
    Faltante: string,
    Cantidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', IdCabeceraFactura)
      .set('IdAsignarProductoLote', IdAsignarProductoLote)
      .set('AplicaDescuento', AplicaDescuento)
      .set('Faltante', Faltante)
      .set('Cantidad', Cantidad)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Credito/IngresoDetalleVenta', body.toString(),
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

  consultarDetalleDeUnaFacturasVenta(
    IdCabeceraFactura: string,
    _token: string
    ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', IdCabeceraFactura)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Factura/ListaFacturaVenta', body.toString(),
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

  consultarFacturasVentasFinalizadas(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Factura/ListaFacturasFinalizadasVenta', body.toString(),
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

  finalizarCabeceraFacturaVenta(
    idCabecera: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabecera)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Factura/FinalizarCabeceraFacturaVenta', body.toString(),
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

  crearConfiguracionVenta(
    idCabeceraFactura: string,
    IdPersona: string,
    IdSembrio: string,
    EstadoConfVenta: string,
    IdConfiguracionInteres: string,
    Efectivo: string,
    Descuento: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('IdPersona', IdPersona)
      .set('IdSembrio', IdSembrio)
      .set('EstadoConfVenta', EstadoConfVenta)
      .set('IdConfiguracionInteres', IdConfiguracionInteres)
      .set('Efectivo', Efectivo)
      .set('Descuento', Descuento)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Factura/IngresoConfigurarVenta', body.toString(),
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

  modificarCantidadDeProductoEnDetalleVenta(
    IdDetalleVenta: string,
    Cantidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdDetalleVenta', IdDetalleVenta)
      .set('Cantidad', Cantidad)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Credito/AumentarDetalleVenta', body.toString(),
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

  quitarDetalleFacturaVenta(
    IdDetalleVenta: string,
    _token: string) {
    const body = new HttpParams()
      .set('IdDetalleVenta', IdDetalleVenta)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Credito/EliminarDetalleVenta', body.toString(),
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

  ingresoDetalleVentaPorKit(
    idCabeceraFactura: string,
    idKit: string,
    cantidad: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('IdKit', idKit)
      .set('Cantidad', cantidad)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + 'Credito/IngresoDetalleVentaPorKit', body.toString(),
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
