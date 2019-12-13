import { Comunidad } from "../comunidad/comunidad";

export interface AsignacionPersonaComunidad {
    IdAsignacionPC?: string;
    IdPersona?: string;
    Comunidad?: Comunidad;
    FechaCreacion?: string;
    Estado?: string;
}
