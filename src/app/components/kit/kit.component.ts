import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Interfaces
import { Kit } from 'src/app/interfaces/kit/kit';

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
      _idAsignacionDescuentoKit: new FormControl('')
    })
  }

  filterKit = '';
  botonIngresar = 'ingresar';

  kits: Kit[] = [];
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
        for (let index = 0; index < ok['respuesta'].length; index++) {
          const element = ok['respuesta'][index];
          console.log(element);
          this.descuentos[index] = {
            idDescuento: element.IdDescuento,
            porcentaje: element.Porcentaje 
          }
        }
        this.filteredOptions = this._kit.valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(value))
            );
        console.log(this.descuentos);
        
      
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )
  }

  seleccionarDescuentoSiExiste(descuento) {
    console.log(descuento);
  }

  validarFormulario() {
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
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Kit ya existe!", {
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
          console.log(ok['respuesta']);
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearAsignacionDescuentoKit() {
    this.inventarioService.crearAsignacionDescuentoKit(
      this._idKit.value,
      this._idDescuento.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);
          this.myForm.reset();
          this.consultarKits();
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
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Kit ya existe!", {
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
            this.testButton.nativeElement.value = 'ingresar';
            this.consultarKits();
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
    console.log(this.descuentos);
    
    const filterValue = value.toLowerCase();
    return this.descuentos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

}
