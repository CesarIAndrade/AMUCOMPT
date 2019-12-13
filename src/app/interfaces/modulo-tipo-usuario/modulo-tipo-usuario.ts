import { Modulo } from '../modulo/modulo';

export interface ModuloTipoUsuario {
    IdModuloTipo?: string;
    IdTipoUsuario?: string;
    Modulo?: Modulo;
    FechaCreacion?: string;
    Estado?: string;
}
