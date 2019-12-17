import { Persona } from '../persona/persona';

export interface Usuario {
    IdUsuario?: string;
    Persona?: Persona;
    UsuarioLogin?: string;
    Contrasena?: string;
    FechaCreacion?: string;
    Estado?: boolean;
}