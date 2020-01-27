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
      _descripcion: new FormControl(''),
      _codigo: new FormControl('', [Validators.required]),
      _contenidoNeto: new FormControl('', [Validators.required]),
    })
  }

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

  nombresDeProductos: any;
  productos: any[] = [];
  tipoProductos: TipoProducto[] = [];
  presentaciones: Presentacion[] = [];
  medidas: Medida[] = [];

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

  consultarProductos() {
    this.inventarioService.consultarConfiguracionProducto(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.productos = [];
          this.productos = ok['respuesta'];
          this.nombresDeProductos = [];

          console.log(this.productos);
          for (var i = 0; i < ok['respuesta'].length; i++) {
            this.nombresDeProductos[i] = ok['respuesta'][i].Producto.Nombre;
            this.nombresDeProductos[i] = {
              idProducto: ok['respuesta'][i].Producto.IdProducto,
              nombre: ok['respuesta'][i].Producto.Nombre,
              idTipoProducto: ok['respuesta'][i].Producto.TipoProducto.IdTipoProducto,
              descripcion: ok['respuesta'][i].Producto.Descripcion,
              codigo: ok['respuesta'][i].Producto.Codigo,
              idMedida: ok['respuesta'][i].Medida.IdMedida
            }
          }

          this.consultarTipoProductos();
          this.filteredOptions = this.myControl.valueChanges
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
          this.actualizarProducto();
        }
      } else {
        console.log("Algo Salio Mal");
      }
    }
  }

  crearProducto() {
    if (this.idProducto == null && this.nombreProducto == null) {
      this.inventarioService.crearProducto(
        this.myControl.value,
        this.myForm.get('_descripcion').value,
        this.myForm.get('_codigo').value,
        this.tipoProducto,
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
    this.idProducto = producto.IdProducto;
    this.tipoProducto = producto.TipoProducto.IdTipoProducto;
    this.myForm.setValue({
      _nombre: producto.Nombre,
      _descripcion: producto.Descripcion,
      _codigo: producto.Codigo
    })
    this.testButton.nativeElement.value = 'modificar';
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
      idProducto,
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
                if (ok['respuesta']) {
                  this.eliminarProducto(producto.Producto.IdProducto);
                }
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

  // get _nombre() {
  //   return this.myForm.get('_nombre');
  // }

  get _descripcion() {
    return this.myForm.get('_descripcion');
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _contenidoNeto() {
    return this.myForm.get('_contenidoNeto');
  }

  testDisabled = false;
  testDisabled2 = false;
  //testDisabled3= false;
  testDisabled4= false;


  test(option) {
    console.log(option);
    
    this.testDisabled = true;
    this.testDisabled2 = true;
    this.testDisabled4 = true;
    //this.testDisabled3 = true;
    
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

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nombresDeProductos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }
}