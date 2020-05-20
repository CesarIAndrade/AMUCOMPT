import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatPaginator, MatTableDataSource } from "@angular/material";

// Services
import { PanelAdministracionService } from 'src/app/services/panel-administracion.service';

@Component({
  selector: "app-modal-localidad-superior",
  templateUrl: "./modal-localidad-superior.component.html",
  styleUrls: ["./modal-localidad-superior.component.css"],
})
export class ModalLocalidadSuperiorComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private panelAdministracionService: PanelAdministracionService
  ) {}

  nombre_tabla = "";
  filter_tabla = "";
  // lista_tabla: any[] = [];

  datosLocalidad = {
    idLocalidad: "",
    descripcion: "",
  };

  // Para la paginacion
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  lista_tabla = new MatTableDataSource<Element[]>();

  consultarProvincias() {
    this.panelAdministracionService
      .consultarProvincias(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.lista_tabla.data = [];
        this.lista_tabla.data = ok["respuesta"];
        this.lista_tabla.paginator = this.paginator;
      })
      .catch((error) => {
        console.log(error);
      });
  } 

  consultarCantones() {
    this.panelAdministracionService
      .consultarCantones(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.lista_tabla.data = [];
        this.lista_tabla.data = ok["respuesta"];
        this.lista_tabla.paginator = this.paginator;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  consultarParroquias() {
    this.panelAdministracionService.consultarParroquias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.lista_tabla.data = [];
          this.lista_tabla.data = ok["respuesta"];
          this.lista_tabla.paginator = this.paginator;
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarComunidades() {
    this.panelAdministracionService.consultarComunidades(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.lista_tabla.data = [];
          this.lista_tabla.data = ok["respuesta"];
          this.lista_tabla.paginator = this.paginator;
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarSembios() {
    this.panelAdministracionService.consultarSembrios(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.lista_tabla.data = [];
        this.lista_tabla.data = ok["respuesta"];
        this.lista_tabla.paginator = this.paginator;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setLocalidad(localidad) {
    if (this.nombre_tabla == "Provincias") {
      this.datosLocalidad.idLocalidad = localidad.IdProvincia;
    } else if (this.nombre_tabla == "Cantones") {
      this.datosLocalidad.idLocalidad = localidad.IdCanton;
    } else if (this.nombre_tabla == "Parroquias") {
      this.datosLocalidad.idLocalidad = localidad.IdParroquia;
    } else if (this.nombre_tabla == "Comunidades") {
      this.datosLocalidad.idLocalidad = localidad.IdComunidad;
    } else if (this.nombre_tabla == "Sembrios") {
      this.datosLocalidad.idLocalidad = localidad.IdSembrio;
    }
    this.datosLocalidad.descripcion = localidad.Descripcion;
  } 

  ngOnInit() {
    console.log(this.data.ruta);
    if (this.data.ruta == "cantones") {
      this.nombre_tabla = "Provincias";
      this.consultarProvincias();
    } else if (this.data.ruta == "parroquias") {
      this.nombre_tabla = "Cantones";
      this.consultarCantones();
    } else if (this.data.ruta == "comunidades") {
      this.nombre_tabla = "Parroquias";
      this.consultarParroquias();
    } else if (this.data.ruta == "sembrios") {
      this.nombre_tabla = "Comunidades";
      this.consultarComunidades();
    } else if (this.data.ruta == "ventas") {
      this.nombre_tabla = "Sembrios";
      this.consultarSembios();
    }
  }

  tabla = ["localidad", "acciones"];
}
