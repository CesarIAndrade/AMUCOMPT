import { Provincia } from "../provincia/provincia";

export interface Canton {
    TdCanton?: string;
    Descripcion?: string;
    Provincia?: Provincia;
    FechaCreacion?: string;
    Estado?: string; 
}
