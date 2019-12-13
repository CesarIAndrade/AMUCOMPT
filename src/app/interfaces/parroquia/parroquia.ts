import { Canton } from "../canton/canton";

export interface Parroquia {
    IdParroquia?: string;
    Descripcion?: string;
    Canton?: Canton;
    FechaCreacion?: string;
    Estado?: string;
}
