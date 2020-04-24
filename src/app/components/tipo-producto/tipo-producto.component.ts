import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

// Services
import { InventarioService } from 'src/app/services/inventario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// SweetAlert
import sweetalert from 'sweetalert';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'app-tipo-producto',
  templateUrl: './tipo-producto.component.html',
  styleUrls: ['./tipo-producto.component.css']
})
export class TipoProductoComponent implements OnInit {

  myForm: FormGroup;

  constructor(private inventarioService: InventarioService
  ) {
    this.myForm = new FormGroup({
      _tipoProducto: new FormControl('', [Validators.required]),
      _idTipoProducto: new FormControl(''),
    })
  }
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  tipoProductos = new MatTableDataSource<Element[]>();

  filterTipoProducto = '';
  botonIngresar = 'ingresar';

  //tipoProductos: any[] = [];

  consultarTipoProductos() {
    this.inventarioService.consultarTipoProductos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoProductos.data = ok['respuesta'];
          this.tipoProductos.paginator = this.paginator;
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
        this.crearTipoProducto();
      } else if (this.botonIngresar == 'modificar') {
        this.actualizarTipoProducto();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }


  crearTipoProducto() {
    this.inventarioService.crearTipoProducto(
      this._tipoProducto.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if(ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if(ok['respuesta'] == '400') {
            sweetAlert("Tipo Producto ya xiste!", {
              icon: "warning",
            });
          } else if(ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.consultarTipoProductos();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarTipoProducto(tipoProducto) {
    this._idTipoProducto .setValue(tipoProducto.IdTipoProducto);
    this._tipoProducto.setValue(tipoProducto.Descripcion)
    this.botonIngresar = 'modificar';
  }

  actualizarTipoProducto() {
    this.inventarioService.actualizarTipoProducto(
      this._idTipoProducto.value,
      this._tipoProducto.value,
      localStorage.getItem('miCuenta.putToken')
    )
    .then(
      ok => {
        if(ok['respuesta'] == null) {
          sweetAlert("Inténtalo de nuevo!", {
            icon: "warning",
          });
        } else if(ok['respuesta'] == '400') {
          sweetAlert("Tipo Producto ya xiste!", {
            icon: "warning",
          });
        } else if(ok['respuesta'] == 'false') {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        } else {
          sweetAlert("Se ingresó correctamente!", {
            icon: "success",
          });
          this.myForm.reset();
          this.botonIngresar = 'ingresar';
          this.consultarTipoProductos();
        }
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  eliminarTipoProducto(idTipoProducto) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.inventarioService.eliminarTipoProducto(
          idTipoProducto,
          localStorage.getItem('miCuenta.deleteToken')
        )
        .then(
          ok => {
            if(ok['respuesta']){
              sweetAlert("Se a eliminado correctamente!", {
                icon: "success",
              });
              this.consultarTipoProductos();
            } else {
              sweetAlert("No se ha podido elminiar!", {
                icon: "error",
              });
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

  get _tipoProducto() {
    return this.myForm.get('_tipoProducto');
  }

  get _idTipoProducto() {
    return this.myForm.get('_idTipoProducto');
  }

  ngOnInit() {
    this.consultarTipoProductos();
  }

  tablaTipoProductos = ['descripcion', 'acciones'];

}
