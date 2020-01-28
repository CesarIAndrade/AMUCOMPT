import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DetallesCompra } from 'src/app/interfaces/detalles-compra/detalles-compra';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ModalAsignacionConfiguracionProductoComponent } from '../modal-asignacion-configuracion-producto/modal-asignacion-configuracion-producto.component';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(
    private modalAsignacionConfiguracionProducto: MatDialog,
    private inventarioService: InventarioService,
  ) {
    this.myForm = new FormGroup({
      _fecha: new FormControl(new Date()),
      _codigo: new FormControl('', [Validators.required]),
      _cantidad: new FormControl('', [Validators.required]),
      _kit: new FormControl('', [Validators.required]),
    })
  }

  botonInsertar = 'ingresar';
  
  seccionProducto = false;
  seccionKit = true;

  detallesCompra: DetallesCompra[] = [
    {
      IdProducto: '1',
      IdKit: '1',
      Kit: 'Colas',
      Producto: 'Coca Cola',
      Presentacion: 'Botella',
      ContenidoNeto: '1',
      Medida: 'Litros'
    },
    {
      IdProducto: '1',
      IdKit: '',
      Kit: '',
      Producto: 'Agua',
      Presentacion: 'Botella',
      ContenidoNeto: '1',
      Medida: 'Litros'
    },
  ];
  kits: any[] = [];
  listaProductosDeUnKit: any[] = [];

  test(event) {
    console.log(event);
    if(event.value == '2') {
      this.seccionKit = false;
      this.seccionProducto = false;
    } else {
      this.seccionProducto = false;
      this.seccionKit = true;
    }
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

  consultarKitsYSusProductos(idKit) {
    this.inventarioService.consultarKitsYSusProductos(
      idKit,
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.listaProductosDeUnKit = [];
          this.listaProductosDeUnKit = ok['respuesta'][0]['ListaAsignarProductoKit'];
          console.log(this.listaProductosDeUnKit);
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  onChangeSelectKit(idKit) {
    this.consultarKitsYSusProductos(idKit);
  }

  validarFormulario() {

  }

  agregarDetalle() {
    let dialogRef = this.modalAsignacionConfiguracionProducto.open(ModalAsignacionConfiguracionProductoComponent, {
      width: '50rem',
      height: '50rem',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.producto.idConfigurarProducto = result.idConfigurarProducto;
        this.producto.nombre = result.nombre;
        this.producto.configuracion = result.presentacion +' '+ result.contenidoNeto
          +' '+ result.medida;
      }
    });
  }

  producto = {
    idConfigurarProducto: '',
    nombre: '',
    configuracion: ''
  }

  quitarDetalle(producto) {
    console.log(producto);
  }

  get _fecha() {
    return this.myForm.get('_fecha');
  }

  get _codigo() {
    return this.myForm.get('_codigo');
  }

  get _cantidad() {
    return this.myForm.get('_cantidad');
  }

  get _kit() {
    return this.myForm.get('_kit');
  }

  ngOnInit() {
    this.consultarKits();
  }

  tablaDetalleCompra = ['kit', 'descripcion', 'acciones'];

}
