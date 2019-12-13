import { TipoTelefono } from "../tipo-telefono/tipo-telefono";

export interface Telefono {
    IdTelefono?: string;
    IdPersona?: string;
    Numero?: string;
    TipoTelefono?: TipoTelefono;
    FechaCreacion?: string;
    Estado?: string;
}
