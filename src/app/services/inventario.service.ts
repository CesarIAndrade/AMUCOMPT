import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }

  private apiUrl = "http://25.70.109.48:90/api/";

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
      .set('Porcentaje', descuento)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoDescuento', body.toString(),
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

  asignarDescuentoKit(
    idKit: string,
    idDescuento: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdKit', idKit)
      .set('IdDescuento', idDescuento)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoAsignarDescuentoKit', body.toString(),
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

  asignarProductoKit(
    idConfigurarProducto: string,
    idAsignarDescuentoKit: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdConfigurarProducto', idConfigurarProducto)
      .set('IdAsignarDescuentoKit', idAsignarDescuentoKit)
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

  consultarDetalleDeUnaFacturasVenta(
    IdCabeceraFactura: string,
    _token: string
    ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', IdCabeceraFactura)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/ListaFacturaVenta', body.toString(),
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
      this.http.post(this.apiUrl + 'Factura/ListaFacturasFinalizadasVenta', body.toString(),
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
      this.http.post(this.apiUrl + 'Credito/IngresoDetalleVenta', body.toString(),
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
      this.http.post(this.apiUrl + 'Factura/IngresoConfigurarVenta', body.toString(),
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

  quitarDetalleFacturaVenta(
    IdDetalleVenta: string,
    _token: string) {
    const body = new HttpParams()
      .set('IdDetalleVenta', IdDetalleVenta)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Credito/EliminarDetalleVenta', body.toString(),
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

  consultarLotesDeUnProducto(
    idCabeceraFactura: string,
    idRelacionLogica: string,
    perteneceKit: string,
    _token: string) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('IdRelacionLogica', idRelacionLogica)
      .set('PerteneceKit', perteneceKit)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/ListaLote', body.toString(),
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

  crearLote(
    codigo: string,
    capacidad: string,
    fechaExpiracion: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('Codigo', codigo)
      .set('Capacidad', capacidad)
      .set('FechaExpiracion', fechaExpiracion)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/IngresoLote', body.toString(),
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

  asignarProductoLote(
    idCabeceraFactura: string,
    cantidad: string,
    idRelacionLogica: string,
    perteneceKit: string,
    precio: string,
    _token: string,
    idLote?: string,
    fechaExpiracion?: string,
  ) {
    const body = new HttpParams()
      .set('IdCabeceraFactura', idCabeceraFactura)
      .set('Cantidad', cantidad)
      .set('IdRelacionLogica', idRelacionLogica)
      .set('PerteneceKit', perteneceKit)
      .set('ValorUnitario', precio)
      .set('encriptada', _token)
      .set('IdLote', idLote)
      .set('FechaExpiracion', fechaExpiracion)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/IngresoAsignarProductoLote', body.toString(),
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
      this.http.post(this.apiUrl + 'Credito/AumentarDetalleVenta', body.toString(),
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

  buscarPrecioDeUnProducto(
    IdAsignarProductoLote: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdAsignarProductoLote', IdAsignarProductoLote)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/BuscarPrecioConfigurarProducto', body.toString(),
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

  buscarLote(
    lote: string,
    idRelacionLogica: string,
    perteneceKit: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('Codigo', lote)
      .set('AsignarProductoLote.IdRelacionLogica', idRelacionLogica)
      .set('AsignarProductoLote.PerteneceKit', perteneceKit)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Factura/BuscarLote', body.toString(),
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

  consultarSembios(_token: string) {
    const body = new HttpParams()
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaSembrios', body.toString(),
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

  crearPrecio(
    idConfigurarProducto: string,
    precio: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdConfigurarProducto', idConfigurarProducto)
      .set('Precio', precio)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/IngresoPrecioConfigurarProducto', body.toString(),
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

  actualizarPrecio(
    idPrecio: string,
    idConfigurarProducto: string,
    precio: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdPrecio', idPrecio)
      .set('IdConfigurarProducto', idConfigurarProducto)
      .set('Precio', precio)
      .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Inventario/ActualizarPrecioConfigurarProducto', body.toString(),
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
