import { Parroquia } from "../parroquia/parroquia";

export interface Comunidad {
    IdComunidad?: string;
    Descripcion?: string;
    Parroquia?: Parroquia;
    FechaCreacion?: string;
    Estado?: string;
}
