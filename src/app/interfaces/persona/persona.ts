import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";

export interface Persona {
    IdPersona?: string;
    NumeroDocumento?: string;
    ApellidoPaterno?: string;
    ApellidoMaterno?: string;
    PrimerNombre?: string;
    SegundoNombre?: string;
    FechaCreacion?: string;
    TipoDocumentos?: TipoDocumentos;
    Estado?: string;
}