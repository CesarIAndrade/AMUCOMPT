import { Privilegios } from '../privilegios/privilegios';

export interface PrivilegioModuloTipo {
    IdPrivilegioModuloTipo?: string;
    Privilegio?: Privilegios;
    IdModuloTipo?: string;
    FechaCreacion?: string;
    Estado?: string;
}
