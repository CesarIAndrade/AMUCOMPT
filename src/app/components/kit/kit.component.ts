import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
      _codigo: new FormControl('', [Validators.required])
    })
  }

  filterKit = '';
  idKit = '0';
  botonIngresar = 'ingresar';
  inputKit = true;

  kits: Kit[] = [];

  onChangeInputKit() {
    this.inputKit = true;
  }

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
      this.myForm.get('_kit').value,
      this.myForm.get('_codigo').value,
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
            this.inputKit = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
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

  mostrarKit(kit) {
    this.idKit = kit.IdKit;
    this.myForm.setValue({
      _kit: kit.Descripcion,
      _codigo: kit.Codigo
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarKit() {
    this.inventarioService.actualizarKit(
      this.idKit,
      this.myForm.get('_kit').value,
      this.myForm.get('_codigo').value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == '400') {
            this.inputKit = false;
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

  ngOnInit() {
    this.consultarKits();
  }

  tablaKits = ['descripcion', 'codigo', 'acciones'];

}
