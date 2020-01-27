import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from 'querystring';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  nombres:string;

  transform(arreglo: any[],texto: string, columna:string, columna1:string,columna2:string,columna3:string,columna4:string): any {    
    if (texto=='') {
      return arreglo;
    }
    texto=texto.toUpperCase();
    if(columna1==null)
    {
      return arreglo.filter(item=>{
        return item[columna].toUpperCase().includes(texto);
      });
    }else
    {
      return arreglo.filter(item=>{
        this.nombres = item[columna].toUpperCase() +' '+ item[columna1].toUpperCase();
        texto = texto.replace(/ /g, "");
        return ((item[columna].toUpperCase()+item[columna1]
                +item[columna2].toUpperCase()+item[columna3]
                .toUpperCase()).toUpperCase().indexOf(texto)>-1)||item[columna4].toUpperCase().includes(texto);
        // item[columna1].toLowerCase().includes(texto)||
        // item[columna2].toLowerCase().includes(texto)||
        // item[columna3].toLowerCase().includes(texto)||
        // item[columna4].toLowerCase().includes(texto);
        //return item[columna].includes(texto);
      });
    }
   
  }

}
