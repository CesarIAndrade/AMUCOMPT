import { Provincia } from "../provincia/provincia";

export interface Canton {
    IdCanton?: string;
    Descripcion?: string;
    Provincia?: Provincia;
    FechaCreacion?: string;
    Estado?: string; 
}
