import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

// Components
import { ModalDetalleProductoComponent } from '../modal-detalle-producto/modal-detalle-producto.component';

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Interfaces
import { TipoProducto } from 'src/app/interfaces/tipo-producto/tipo-producto';
import { Presentacion } from 'src/app/interfaces/presentacion/presentacion';
import { Medida } from 'src/app/interfaces/medida/medida';
import { DetalleProducto } from '../armar-kit/armar-kit.component';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      _nombre: new FormControl('', [Validators.required]),
      _descripcion: new FormControl(''),
      _codigo: new FormControl('', [Validators.required]),
      _contenidoNeto: new FormControl('', [Validators.required]),
    })
  }

  idConfiguracionProducto: string;
  idProducto: string;
  tipoProducto = '0';
  presentacion = '0';
  medida = '0';
  botonIngresar = 'ingresar';
  filterProducto = '';
  nombreProducto: string;
  selectTipoProducto = true;
  selectPresentacion = true;
  selectMedida = true;
  inputNombreProducto = true;
  CampoTipoProducto = false;

  filteredOptions: Observable<string[]>;

  nombresDeProductos: any;
  productos: any[] = [];
  tipoProductos: TipoProducto[] = [
    {
      IdPresentacion: '1',
      Descripcion: 'TPRO1'
    },
    {
      IdPresentacion: '1',
      Descripcion: 'TPRO2'
    },
    {
      IdPresentacion: '1',
      Descripcion: 'TPRO3'
    },
  ];
  presentaciones: Presentacion[] = [
    {
      IdPresentacion: '1',
      Descripcion: 'PRE1'
    },
    {
      IdPresentacion: '2',
      Descripcion: 'PRE2'
    },
    {
      IdPresentacion: '3',
      Descripcion: 'PRE3'
    },
  ];
  medidas: Medida[] = [
    {
      IdMedida: '1',
      Descripcion: 'MED1'
    },
    {
      IdMedida: '2',
      Descripcion: 'MED2'
    },
    {
      IdMedida: '3',
      Descripcion: 'MED3'
    },
  ];

  ArrayProductos: any[] = [];
  applyFilter(event, columna) {
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
          this.nombresDeProductos = [];
          console.log(ok['respuesta']);
          for (var i = 0; i < (ok['respuesta'].length); i++) {
            this.nombresDeProductos[i] = {
              idProducto: ok['respuesta'][i].Producto.IdProducto,
              nombre: ok['respuesta'][i].Producto.Nombre,
              idTipoProducto: ok['respuesta'][i].Producto.TipoProducto.IdTipoProducto,
              descripcion: ok['respuesta'][i].Producto.Descripcion,
              codigo: ok['respuesta'][i].Producto.Codigo,
              idMedida: ok['respuesta'][i].Medida.IdMedida
            }
          }
          this.consultarConfiguracionProductoTodos();
          this.consultarTipoProductos();
          this.filteredOptions = this.myForm.get('_nombre').valueChanges
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

  validarSelects(
    tipoProducto: string,
    presentacion: string,
    medida: string,
  ) {
    if (tipoProducto == "0") {
      this.selectTipoProducto = false;
    }
    if (presentacion == "0") {
      this.selectPresentacion = false;
    }
    if (medida == "0") {
      this.selectMedida = false;
    }
  }

  validarFormulario() {
    this.validarSelects(
      this.tipoProducto,
      this.presentacion,
      this.medida
    );
    if (this.tipoProducto != '0' && this.presentacion != '0' && this.medida != '0') {
      if (this.myForm.valid) {
        if (this.testButton.nativeElement.value == 'ingresar') {
          this.crearProducto();
        } else if (this.testButton.nativeElement.value == 'modificar') {
          this.actualizarConfiguracionProducto();

        }
      } else {
        console.log("Algo Salio Mal");
      }
    }
  }

  crearProducto() {
    if (this.idProducto == '' && this.nombreProducto == '') {
      this.inventarioService.crearProducto(
        this.myForm.get('_nombre').value,
        this.myForm.get('_descripcion').value,
        this.myForm.get('_codigo').value,
        this.tipoProducto,
        localStorage.getItem('miCuenta.postToken')
      )
        .then(
          ok => {
            if (ok['respuesta'] == null) {
              sweetAlert("Inténtalo de nuevo!", {
                icon: "warning",
              });
              this.myForm.reset();
              this.tipoProducto = '0';
              this.presentacion = '0';
              this.medida = '0';
            } else if (ok['respuesta'] == '400') {
              this.inputNombreProducto = false;
            } else if (ok['respuesta'] == 'false') {
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            } else {
              this.idProducto = ok['respuesta'];
              this.crearConfiguracionProducto();
              this.consultarProductos();
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
    this.myForm.get('_nombre').disable();
    this.myForm.get('_descripcion').disable();
    this.myForm.get('_codigo').disable();
    this.CampoTipoProducto = true;
    this.idConfiguracionProducto = producto.IdConfigurarProducto;
    this.myForm.get('_nombre').setValue(producto.Producto.Nombre);
    this.myForm.get('_descripcion').setValue(producto.Producto.Descripcion);
    this.myForm.get('_codigo').setValue(producto.Producto.Codigo);
    this.myForm.get('_contenidoNeto').setValue(producto.CantidadMedida);
    this.tipoProducto = producto.Producto.TipoProducto.IdTipoProducto;
    this.presentacion = producto.Presentacion.IdPresentacion;
    this.medida = producto.Medida.IdMedida;
    this.idProducto = producto.Producto.IdProducto;
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarConfiguracionProducto() {
    this.inventarioService.actualizarConfiguracionProducto(
      this.idConfiguracionProducto,
      localStorage.getItem('miCuenta.idAsignacionTipoUsuario'),
      this.idProducto,
      this.medida,
      this.presentacion,
      this.myForm.get('_contenidoNeto').value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
            this.tipoProducto = '0';
            this.presentacion = '0';
            this.medida = '0';
          } else if (ok['respuesta'] == '400') {
            this.inputNombreProducto = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.testButton.nativeElement.value = 'ingresar';
            this.consultarProductos();
            this.myForm.get('_nombre').enable();
            this.myForm.get('_descripcion').enable();
            this.myForm.get('_codigo').enable();
            this.CampoTipoProducto = false;
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }


  actualizarProducto() {
    this.inventarioService.actualizarProducto(
      this.idProducto,
      this.myForm.get('_nombre').value,
      this.myForm.get('_descripcion').value,
      this.myForm.get('_codigo').value,
      this.tipoProducto,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
            this.tipoProducto = '0';
            this.presentacion = '0';
            this.medida = '0';
          } else if (ok['respuesta'] == '400') {
            this.inputNombreProducto = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.testButton.nativeElement.value = 'ingresar';
            this.consultarProductos();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarProducto(idProducto) {
    this.inventarioService.eliminarProducto(
      idProducto.IdConfigurarProducto,
      localStorage.getItem('miCuenta.deleteToken')
    )
      .then(
        ok => {
          this.consultarProductos();
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
      this.idProducto,
      this.medida,
      this.presentacion,
      this.myForm.get('_contenidoNeto').value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
            this.tipoProducto = '0';
            this.presentacion = '0';
            this.medida = '0';
          } else if (ok['respuesta'] == '400') {
            this.inputNombreProducto = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.tipoProducto = '0';
            this.presentacion = '0';
            this.medida = '0';
            this.consultarProductos();
            this.myForm.get('_nombre').enable();
            this.myForm.get('_descripcion').enable();
            this.myForm.get('_codigo').enable();
            this.CampoTipoProducto = false;
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
            localStorage.getItem('miCuenta.postToken')
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
    var detalleProducto: DetalleProducto;
    detalleProducto = {
      presentacion: producto.Presentacion.Descripcion,
      contenidoNeto: producto.CantidadMedida,
      medida: producto.Medida.Descripcion
    }
    let dialogRef = this.dialog.open(ModalDetalleProductoComponent, {
      width: '325px',
      height: '275px',
      data: {
        producto: detalleProducto
      }
    });
  }

  onChangeSelectTipoProducto(value) {
    if (value != "0") {
      this.selectTipoProducto = true;
    }
  }

  onChangeSelectPresentacion(value) {
    if (value != "0") {
      this.selectPresentacion = true;
    }
  }

  onChangeSelectMedida(value) {
    if (value != "0") {
      this.selectMedida = true;
    }
  }

  onChangeInputNombreProducto() {
    this.inputNombreProducto = true;
  }

  get _nombre() {
    return this.myForm.get('_nombre');
  }

  get _descripcion() {
    return this.myForm.get('_descripcion');
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _contenidoNeto() {
    return this.myForm.get('_contenidoNeto');
  }
  onKeydownEvent(event) {
    this.idProducto = '';
    this.nombreProducto = '';
  }
  test(option) {
    this.myForm.get('_nombre').disable();
    this.myForm.get('_descripcion').disable();
    this.myForm.get('_codigo').disable();
    this.CampoTipoProducto = true;

    this.medida = option.idMedida
    this.idProducto = option.idProducto;
    this.nombreProducto = option.nombre;
    this.tipoProducto = option.idTipoProducto;
    this.myForm.get('_descripcion').setValue(option.descripcion);
    this.myForm.get('_codigo').setValue(option.codigo);
  }

  ngOnInit() {
    this.consultarProductos();
    this.consultarMedidas();
    this.consultarPresentaciones();
  }

  tablaProductos = ['nombre', 'tipoProducto', 'codigo', 'acciones'];

  private _filterTable(value: string, arreglo: any[]) {
    const filterValue = value.toLowerCase();
    if (value == '') {
      this.productos = this.ArrayProductos;
    } else {
      this.productos = this.ArrayProductos.filter(option => option['Producto']['Nombre'].trim().toLowerCase().includes(filterValue.trim()));
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nombresDeProductos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }
}