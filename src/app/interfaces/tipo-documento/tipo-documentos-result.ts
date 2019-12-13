import { TipoDocumento } from "../tipo-documento/tipo-documento";

export interface TipoDocumentosResult {
    codigo?: string;
    mesanje?: string;
    respuesta?: TipoDocumento[];
}
