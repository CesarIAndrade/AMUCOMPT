import { TipoUsuario } from '../tipo-usuario/tipo-usuario';

export interface AsignacionTipoUsuario {
    IdAsignacionTU?: string;
    IdUsuario?: string;
    TipoUsuario?: TipoUsuario;
    FechaCreacion?: string;
    Estado?: string;
}
