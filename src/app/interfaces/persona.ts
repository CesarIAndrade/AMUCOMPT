import { tipoDocumento } from "./tipoDocumento";

export interface persona {
    IdPersona?: string;
    NumeroDocumento?: string;
    ApellidoPaterno?: string;
    ApellidoMaterno?: string;
    PrimerNombre?: string;
    SegundoNombre?: string;
    FechaCreacion?: string;
    IdTipoDocumento?: tipoDocumento;
    Estado?: string;
}