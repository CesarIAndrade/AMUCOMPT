import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }
  //private apiUrl = "http://localhost:49962/api/";

  private apiUrl = "http://192.168.25.20:90/api/";

  consultarTipoProductos(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaTipoProductos', body.toString(),
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

  crearTipoProducto(tipoProducto: string, _token: string) {
    const body = new HttpParams()
      .set('Descripcion', tipoProducto)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoTipoProducto', body.toString(),
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

  actualizarTipoProducto(
    idTipoProducto: string,
    tipoProducto: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdTipoProducto', idTipoProducto)
      .set('Descripcion', tipoProducto)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ActualizarTipoProducto', body.toString(),
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

  eliminarTipoProducto(idTipoProducto: string, _token: string) {
    const body = new HttpParams()
      .set('IdTipoProducto', idTipoProducto)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/EliminarTipoProducto', body.toString(),
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

  consultarProductos(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaProductos', body.toString(),
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

  crearProducto(
    nombre: string,
    descripcion: string,
    idTipoProducto: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('Nombre', nombre)
      .set('Descripcion', descripcion)
      .set('IdTipoProducto', idTipoProducto)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoProducto', body.toString(),
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

  actualizarProducto(
    idProducto: string,
    nombre: string,
    descripcion: string,
    idTipoProducto: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdProducto', idProducto)
      .set('Nombre', nombre)
      .set('Descripcion', descripcion)
      .set('IdTipoProducto', idTipoProducto)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ActualizarProducto', body.toString(),
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

  eliminarProducto(idProducto: string, _token: string) {
    const body = new HttpParams()
      .set('IdProducto', idProducto)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/EliminarProducto', body.toString(),
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

  consultarPresentaciones(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaPresentacion', body.toString(),
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

  crearPresentacion(presentacion: string, _token: string) {
    const body = new HttpParams()
      .set('Descripcion', presentacion)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoPresentacion', body.toString(),
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

  actualizarPresentacion(
    idPresentacion: string,
    presentacion: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPresentacion', idPresentacion)
      .set('Descripcion', presentacion)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ActualizarPresentacion', body.toString(),
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

  eliminarPresentacion(idPresentacion: string, _token: string) {
    const body = new HttpParams()
      .set('IdPresentacion', idPresentacion)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/EliminarPresentacion', body.toString(),
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

  consultarMedidas(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaMedidas', body.toString(),
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

  crearMedida(medida: string, _token: string) {
    const body = new HttpParams()
      .set('Descripcion', medida)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoMedida', body.toString(),
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

  actualizarMedida(
    idMedida: string,
    medida: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdMedida', idMedida)
      .set('Descripcion', medida)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ActualizarMedida', body.toString(),
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

  eliminarMedida(idMedida: string, _token: string) {
    const body = new HttpParams()
      .set('IdMedida', idMedida)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/EliminarMedida', body.toString(),
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

  consultarConfiguracionProductoTodos(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaConfigurarProductosTodos', body.toString(),
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

  consultarConfiguracionProducto(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaConfigurarProductos', body.toString(),
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

  crearConfiguracionProducto(
    idAsignacionTu: string,
    idProducto: string,
    idMedida: string,
    idPresentacion: string,
    codigo: string,
    cantidadMedida: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdAsignacionTu', idAsignacionTu)
      .set('IdProducto', idProducto)
      .set('IdMedida', idMedida)
      .set('IdPresentacion', idPresentacion)
      .set('Codigo', codigo)
      .set('CantidadMedida', cantidadMedida)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoConfigurarProducto', body.toString(),
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

  actualizarConfiguracionProducto(
    idConfigurarProducto: string,
    idAsignacionTu: string,
    idProducto: string,
    idMedida: string,
    idPresentacion: string,
    codigo: string,
    cantidadMedida: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdConfigurarProducto', idConfigurarProducto)
      .set('IdAsignacionTu', idAsignacionTu)
      .set('IdProducto', idProducto)
      .set('IdMedida', idMedida)
      .set('IdPresentacion', idPresentacion)
      .set('Codigo', codigo)
      .set('CantidadMedida', cantidadMedida)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ActualizarConfigurarProducto', body.toString(),
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

  eliminarConfiguracionProducto(
    idConfigurarProducto: string,
    idProducto: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdConfigurarProducto', idConfigurarProducto)
      .set('IdProducto', idProducto)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/EliminarConfigurarProducto', body.toString(),
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

  consultarKits(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaKit', body.toString(),
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

  crearKit(
    kit: string,
    codigo: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('Descripcion', kit)
      .set('Codigo', codigo)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoKit', body.toString(),
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

  actualizarKit(
    idKit: string,
    kit: string,
    codigo: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdKit', idKit)
      .set('Descripcion', kit)
      .set('Codigo', codigo)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ActualizarKit', body.toString(),
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

  eliminarKit(idKit: string, _token: string) {
    const body = new HttpParams()
      .set('IdKit', idKit)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/EliminarKit', body.toString(),
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

  consultarDescuentos(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaDescuento', body.toString(),
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

  crearDescuentoKit(
    descuento: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('Descuento', descuento)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '', body.toString(),
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

  crearAsignacionDescuentoKit(
    idKit: string,
    idDescuento: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdKit', idKit)
      .set('IdDescuento', idDescuento)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '', body.toString(),
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

  actualizarAsignacionDescuentoKit(
    idAsignacionDescuentoKit: string,
    idKit: string,
    idDescuento: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdAsignacionDescuentoKit', idAsignacionDescuentoKit)
      .set('IdKit', idKit)
      .set('IdDescuento', idDescuento)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '', body.toString(),
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

  consultarKitsYSusProductos(idKit: string, _token: string) {
    const body = new HttpParams()
      .set('IdKit', idKit)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaAsignarProductoKit', body.toString(),
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

  consultarProductosQueNoTieneUnKit(idKit: string, _token: string) {
    const body = new HttpParams()
      .set('IdKit', idKit)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaConfigurarProductosQueNoTieneUnKit', body.toString(),
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

  crearAsignacionProductoKit(
    idConfigurarProducto: string,
    idKit: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdConfigurarProducto', idConfigurarProducto)
      .set('IdKit', idKit)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoAsignarProductoKit', body.toString(),
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

  eliminarAsignacionProductoKit(
    idAsignarProductoKit: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdAsignarProductoKit', idAsignarProductoKit)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/EliminarAsignarProductoKit', body.toString(),
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

  consultarTipoTransaccion(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ListaTipoTransaccion', body.toString(),
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
      this.http.post(this.apiUrl + 'Factura/ListaFacturasNoFinalizadas', body.toString(),
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
      this.http.post(this.apiUrl + 'Factura/IngresoCabeceraFactura', body.toString(),
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

  finalizarFactura(idCabecera: string, _token: string) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabecera)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/FinalizarCabeceraFactura', body.toString(),
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
    idRelacionLogica: string,
    perteneceKit: string,
    cantidad: string,
    fechaExpiracion: string,
    precio: string,
    faltante: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('IdRelacionLogica', idRelacionLogica)
      .set('PerteneceKit', perteneceKit)
      .set('Cantidad', cantidad)
      .set('FechaExpedicion', fechaExpiracion)
      .set('ValorUnitario', precio)
      .set('Faltante', faltante)
      .set('encriptada', _token)
    console.log(body);


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

  actualizarDetalleFactura(
    idDetalleFactura: string,
    idCabeceraFactura: string,
    idRelacionLogica: string,
    perteneceKit: string,
    cantidad: string,
    fechaExpiracion: string,
    precio: string,
    faltante: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('IdDetalleFactura', idDetalleFactura)
      .set('IdRelacionLogica', idRelacionLogica)
      .set('PerteneceKit', perteneceKit)
      .set('Cantidad', cantidad)
      .set('FechaExpedicion', fechaExpiracion)
      .set('ValorUnitario', precio)
      .set('Faltante', faltante)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '', body.toString(),
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

  eliminarDetalleFactura(
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

  consultarStock(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/ListarStock', body.toString(),
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
