import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

// Components
import { ModalDetalleProductoComponent } from '../modal-detalle-producto/modal-detalle-producto.component';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      _nombre: new FormControl('', [Validators.required]),
      _tipoProducto: new FormControl('', [Validators.required]),
      _codigo: new FormControl('', [Validators.required]),
      _presentacion: new FormControl('', [Validators.required]),
      _contenidoNeto: new FormControl('', [Validators.required]),
      _medida: new FormControl('', [Validators.required]),
      _descripcion: new FormControl(''),
      _productoExistente: new FormControl(''),
      _idProducto: new FormControl(''),
      _idConfiguracionProducto: new FormControl(''),
    })
  }

  botonIngresar = 'ingresar';
  filterProducto = '';

  filteredOptions: Observable<string[]>;

  nombresDeProductos: any[] = [];
  productos: any[] = [];
  tipoProductos: any[] = [];
  presentaciones: any[] = [];
  medidas: any[] = [];
  ArrayProductos: any[] = [];

  applyFilter(event) {
    this._filterTable(event, this.productos);
  }

  consultarTipoProductos() {
    this.inventarioService.consultarTipoProductos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoProductos = [];
          this.tipoProductos = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarPresentaciones() {
    this.inventarioService.consultarPresentaciones(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.presentaciones = [];
          this.presentaciones = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarMedidas() {
    this.inventarioService.consultarMedidas(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.medidas = [];
          this.medidas = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarConfiguracionProductoTodos() {
    this.inventarioService.consultarConfiguracionProductoTodos(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          
          this.productos = [];
          this.productos = ok['respuesta'];
          this.ArrayProductos = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarProductos() {
    this.inventarioService.consultarConfiguracionProducto(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          for (let index = 0; index < (ok['respuesta'].length); index++) {
            const element = ok['respuesta'][index];
            this.nombresDeProductos[index] = {
              idProducto: element.Producto.IdProducto,
              nombre: element.Producto.Nombre,
              idTipoProducto: element.Producto.TipoProducto.IdTipoProducto,
              descripcion: element.Producto.Descripcion,
              codigo: element.Producto.Codigo,
              idMedida: element.Medida.IdMedida
            }
          }
          this.consultarConfiguracionProductoTodos();
          this.consultarTipoProductos();
          console.log(ok['respuesta']);
          console.log(this.nombresDeProductos);
          this.filteredOptions = this._nombre.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.botonIngresar == 'ingresar') {
        this.crearProducto();
      } else if (this.botonIngresar == 'modificar') {
        this.actualizarConfiguracionProducto();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearProducto() {
    if (this._idProducto.value == '' && this._productoExistente.value == '') {
      this.inventarioService.crearProducto(
        this._nombre.value,
        this._descripcion.value,
        this._tipoProducto.value,
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {
            if (ok['respuesta'] == null) {
              sweetAlert("Inténtalo de nuevo!", {
                icon: "warning",
              });
              this.myForm.reset();
            } else if (ok['respuesta'] == '400') {
              sweetAlert("Producto Ya Existe!", {
                icon: "warning",
              });
            } else if (ok['respuesta'] == 'false') {
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            } else {
              this._idProducto.setValue(ok['respuesta']);
              this.crearConfiguracionProducto();
            }
          }
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    } else {
      this.crearConfiguracionProducto();
    }
  }

  mostrarProducto(producto) {
    this._nombre.disable();
    this._descripcion.disable();
    this._tipoProducto.disable();
    this._idConfiguracionProducto.setValue(producto.IdConfigurarProducto);
    this._nombre.setValue(producto.Producto.Nombre);
    this._descripcion.setValue(producto.Producto.Descripcion);
    this._codigo.setValue(producto.Codigo);
    this._contenidoNeto.setValue(producto.CantidadMedida);
    this._tipoProducto.setValue(producto.Producto.TipoProducto.IdTipoProducto);
    this._presentacion.setValue(producto.Presentacion.IdPresentacion);
    this._medida.setValue(producto.Medida.IdMedida);
    this._idProducto.setValue(producto.Producto.IdProducto);
    this.botonIngresar = 'modificar';
  }

  actualizarConfiguracionProducto() {
    this.inventarioService.actualizarConfiguracionProducto(
      this._idConfiguracionProducto.value,
      localStorage.getItem('miCuenta.idAsignacionTipoUsuario'),
      this._idProducto.value,
      this._medida.value,
      this._presentacion.value,
      this._codigo.value,
      this._contenidoNeto.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Producto Ya Existe!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.botonIngresar = 'ingresar';
            this.consultarProductos();
            this._nombre.enable();
            this._descripcion.enable();
            this._codigo.enable();
            this._tipoProducto.enable();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearConfiguracionProducto() {
    this.inventarioService.crearConfiguracionProducto(
      localStorage.getItem('miCuenta.idAsignacionTipoUsuario'),
      this._idProducto.value,
      this._medida.value,
      this._presentacion.value,
      this._codigo.value,
      this._contenidoNeto.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);
          
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Producto Ya Existe!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.consultarProductos();
            this._nombre.enable();
            this._descripcion.enable();
            this._codigo.enable();
            this._tipoProducto.enable();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarConfiguracionProducto(producto) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.inventarioService.eliminarConfiguracionProducto(
            producto.IdConfigurarProducto,
            producto.Producto.IdProducto,
            localStorage.getItem('miCuenta.deleteToken')
          )
            .then(
              ok => {
                console.log(ok['respuesta']);
                this.consultarProductos();
              }
            )
            .catch(
              error => {
                console.log(error);
              }
            )
        }
      });
  }

  mostrarDetalleProducto(producto) {
    var detalleProducto: any;
    detalleProducto = {
      presentacion: producto.Presentacion.Descripcion,
      contenidoNeto: producto.CantidadMedida,
      medida: producto.Medida.Descripcion
    }
    let dialogRef = this.dialog.open(ModalDetalleProductoComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        producto: detalleProducto
      }
    });
  }

  get _nombre() {
    return this.myForm.get('_nombre');
  }

  get _tipoProducto() {
    return this.myForm.get('_tipoProducto');
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _presentacion() {
    return this.myForm.get('_presentacion');
  }

  get _contenidoNeto() {
    return this.myForm.get('_contenidoNeto');
  }

  get _medida() {
    return this.myForm.get('_medida');
  }

  get _descripcion() {
    return this.myForm.get('_descripcion');
  }

  get _productoExistente() {
    return this.myForm.get('_productoExistente');
  }

  get _idProducto() {
    return this.myForm.get('_idProducto');
  }

  get _idConfiguracionProducto() {
    return this.myForm.get('_idConfiguracionProducto');
  }

  seleccionarProductoSiExiste(producto) {
    this._nombre.disable();
    this._descripcion.disable();
    this._tipoProducto.disable();
    this._idProducto.setValue(producto.idProducto);
    this._productoExistente.setValue(producto.nombre);
    this._tipoProducto.setValue(producto.idTipoProducto);
    this._descripcion.setValue(producto.descripcion);
    this._codigo.setValue(producto.codigo);
  }

  ngOnInit() {
    this.consultarProductos();
    this.consultarMedidas();
    this.consultarPresentaciones();
  }

  tablaProductos = ['codigo', 'descripcion', 'tipoProducto', 'acciones'];

  private _filterTable(value: string, arreglo: any[]) {
    const filterValue = value;
    if (value == '') {
      this.productos = this.ArrayProductos;
    } else {
      this.productos = this.ArrayProductos.filter(option => option['Producto']['Nombre'].trim().includes(filterValue.trim()));
    }
  }

  private _filter(value: string): string[] 
  {
    
    try {
      const filterValue = value.toLowerCase();
      return this.nombresDeProductos.filter(option => option.nombre.toLowerCase().includes(filterValue)); 
    } catch (error) {
    }
  }
}