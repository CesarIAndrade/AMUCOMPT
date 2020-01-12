import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(arreglo: any[],texto: string, columna:string): any {
    if (texto=='') {
      return arreglo;
    }
    //texto.toLowerCase();
    //console.log(texto.toLowerCase());
    return arreglo.filter(item=>{
      return item[columna].toLowerCase().includes(texto);
    });
  }

}
