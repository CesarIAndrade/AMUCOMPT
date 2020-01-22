import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }

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
    codigo: string,
    idTipoProducto: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('Nombre', nombre)
      .set('Descripcion', descripcion)
      .set('Codigo', codigo)
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
    codigo: string,
    idTipoProducto: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdProducto', idProducto)
      .set('Nombre', nombre)
      .set('Descripcion', descripcion)
      .set('Codigo', codigo)
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
    cantidadMedida: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdAsignacionTu', idAsignacionTu)
      .set('IdProducto', idProducto)
      .set('IdMedida', idMedida)
      .set('IdPresentacion', idPresentacion)
      .set('CantidadMedida', cantidadMedida)
      .set('encriptada', _token)

    console.log(body);
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
    cantidadMedida: string,
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdConfigurarProducto', idConfigurarProducto)
      .set('IdAsignacionTu', idAsignacionTu)
      .set('IdProducto', idProducto)
      .set('IdMedida', idMedida)
      .set('IdPresentacion', idPresentacion)
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
    _token: string
  ) {
    const body = new HttpParams()
      .set('IdConfigurarProducto', idConfigurarProducto)
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
}
