import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-kit',
  templateUrl: './kit.component.html',
  styleUrls: ['./kit.component.css']
})
export class KitComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private inventarioService: InventarioService) {
    this.myForm = new FormGroup({
      _kit: new FormControl('', [Validators.required]),
      _codigo: new FormControl('', [Validators.required]),
      _idKit: new FormControl(''),
      _descuento: new FormControl('', [Validators.required]),
      _idDescuento: new FormControl(''),
      _idAsignacionDescuentoKit: new FormControl(''),
    })
  }

  get _tempDescuento() {
    return this.myForm.get('_tempDescuento');
  }

  filterKit = '';
  botonIngresar = 'ingresar';

  kits: any[] = [];
  descuentos: any[] = [];

  filteredOptions: Observable<string[]>;

  consultarKits() {
    this.inventarioService.consultarKits(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.kits = [];
          this.kits = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarDescuentos() {
    this.inventarioService.consultarDescuentos(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.descuentos = [];
          for (let index = 0; index < ok['respuesta'].length; index++) {
            const element = ok['respuesta'][index];
            this.descuentos[index] = {
              IdDescuento: element.IdDescuento,
              Porcentaje: String(element.Porcentaje)
            }
          }
          this.filteredOptions = this._descuento.valueChanges
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

  seleccionarDescuentoSiExiste(descuento) {
    this._idDescuento.setValue(descuento.IdDescuento);
    this._descuento.setValue(descuento.Porcentaje);
  }

  validarFormulario() {
    console.log(this.testButton.nativeElement.value);

    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == 'ingresar') {
        this.crearKit();
      } else if (this.testButton.nativeElement.value == 'modificar') {

        this.actualizarKit();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearKit() {
    this.inventarioService.crearKit(
      this._kit.value,
      this._codigo.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Kit ya existe!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this._idKit.setValue(ok['respuesta']);
            this.crearDescuento();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearDescuento() {
    this.inventarioService.crearDescuentoKit(
      this._descuento.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (typeof (ok['respuesta']) == 'string') {
            this._idDescuento.setValue(ok['respuesta']);
            this.crearAsignacionDescuentoKit();
          } else {
            this._idDescuento.setValue(ok['respuesta'].IdDescuento);
            this.crearAsignacionDescuentoKit();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearAsignacionDescuentoKit() {
    // console.log(this._idKit.value);
    // console.log(this._idDescuento.value);
    
    this.inventarioService.crearAsignacionDescuentoKit(
      this._idKit.value,
      this._idDescuento.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          this.myForm.reset();
          this.consultarKits();
          this.consultarDescuentos();
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarKit(kit) {
    this._idKit.setValue(kit.IdKit);
    this._kit.setValue(kit.Descripcion);
    this._codigo.setValue(kit.Codigo);
    this._descuento.setValue(kit.AsignarDescuentoKit.Descuento.Porcentaje);
    this._idDescuento.setValue(kit.AsignarDescuentoKit.Descuento.IdDescuento);
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarKit() {
    this.inventarioService.actualizarKit(
      this._idKit.value,
      this._kit.value,
      this._codigo.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
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
            this.crearDescuento();
            this.testButton.nativeElement.value = 'ingresar';
            this.consultarKits();
            this.consultarDescuentos();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  actualizarAsignacionDescuentoKit() {
    this.inventarioService.actualizarAsignacionDescuentoKit(
      this._idAsignacionDescuentoKit.value,
      this._idKit.value,
      this._idDescuento.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);

        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarKit(idKit) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.inventarioService.eliminarKit(
            idKit,
            localStorage.getItem('miCuenta.deleteToken')
          )
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se a eliminado correctamente!", {
                    icon: "success",
                  });
                  this.consultarKits();
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

  get _kit() {
    return this.myForm.get('_kit');
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _idKit() {
    return this.myForm.get('_idKit');
  }

  get _descuento() {
    return this.myForm.get('_descuento');
  }

  get _idDescuento() {
    return this.myForm.get('_idDescuento');
  }

  get _idAsignacionDescuentoKit() {
    return this.myForm.get('_idAsignacionDescuentoKit');
  }

  ngOnInit() {
    this.consultarKits();
    this.consultarDescuentos();
  }

  tablaKits = ['descripcion', 'codigo', 'descuento', 'acciones'];

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.descuentos.filter(option => option.Porcentaje.toLowerCase().includes(filterValue));
  }

}
