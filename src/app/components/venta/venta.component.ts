import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalAsignacionUsuarioPersonaComponent } from '../modal-asignacion-usuario-persona/modal-asignacion-usuario-persona.component';
import { MatDialog } from "@angular/material/dialog";
import { ModalAsignacionConfiguracionProductoComponent } from '../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private modalAsignacionUsuarioPersona: MatDialog,
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
  ) { 
    this.myForm = new FormGroup({
      _cabecera: new FormControl(''),
      _fechaActual: new FormControl(''),
      _producto: new FormControl('', [Validators.required]),
      _cantidad: new FormControl('', [Validators.required]),
      _precio: new FormControl('', [Validators.required]),
      _persona: new FormControl('', [Validators.required]),
      _cedula: new FormControl('', [Validators.required]),
      _idPersona: new FormControl('', [Validators.required]),
      _nombres: new FormControl('', [Validators.required]),
      _sembrio: new FormControl('', [Validators.required]),
    })
  }

  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

sembrios: any[] = [];

  filteredOptions: Observable<string[]>;

  seleccionarPersona() {
    let dialogRef = this.modalAsignacionUsuarioPersona.open(ModalAsignacionUsuarioPersonaComponent, {
      width: '700px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._cedula.setValue(result.cedula);
        this._idPersona.setValue(result.idPersona);
        var nombres = result.nombres +' '+ result.apellidos
        this._nombres.setValue(nombres);
      }
    });
  }

  seleccionarProducto() {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(ModalAsignacionConfiguracionProductoComponent, {
      width: '800px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
      if (result != null) {
        var producto = result.Producto + ' ' + result.Presentacion + ' ' + result.ContenidoNeto
          + ' ' + result.Medida;
        // this._idRelacionLogica.setValue(result.idRelacionLogica);
        // this._perteneceKit.setValue(result.perteneceKit);
        this._producto.setValue(producto);
        // this.consultarLotesDeUnProducto();
        // this.buscarFechaYPrecio();
        // this._fechaExpiracion.reset();
        // this.dateIcon = true;
        // this._lote.reset();
        this._cantidad.reset();
        this._precio.reset();
      }
    });
  }

  consultarSembios() {
    this.inventarioService.consultarSembios(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.sembrios = ok['respuesta'];
          this.filteredOptions = this._sembrio.valueChanges
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

  seleccionarSembrioSiExiste(sembrio) {
    console.log(sembrio);
  }

  get _producto() {
    return this.myForm.get('_producto');
  }

  get _cantidad() {
    return this.myForm.get('_cantidad');
  }

  get _precio() {
    return this.myForm.get('_precio');
  }

  get _cedula() {
    return this.myForm.get('_cedula');
  }

  get _nombres() {
    return this.myForm.get('_nombres');
  }

  get _idPersona() {
    return this.myForm.get('_idPersona');
  }
  
  get _sembrio() {
    return this.myForm.get('_sembrio');
  }


  ngOnInit() {
    this.consultarSembios();
  }

  private _filter(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
      return this.sembrios.filter(option => option.Descripcion.toLowerCase().includes(filterValue));
    } catch (error) {
    }
  }

  tablaDetalleCompra = ['codigo', 'kit', 'descripcion', 'presentacion', 'lote', 'fechaExpiracion', 'valorUnitario', 'cantidad', 'total', 'acciones'];

}
