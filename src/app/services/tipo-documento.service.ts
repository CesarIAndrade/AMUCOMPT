import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Interfaces
import { TipoDocumentosResult } from "../interfaces/tipo-documento/tipo-documentos-result";

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private apiUrl:string = "http://192.168.25.15:90/api/";
  private _headers = new HttpHeaders({'Content-Type':'application/json'});
  private _params = new HttpParams();

  constructor(private http: HttpClient) { }

  consultatTipoDocumentos(){
    return this.http.get<TipoDocumentosResult>(`${this.apiUrl}`);
  }
}
