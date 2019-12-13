import { Correo } from "./correo";

export interface CorreosResult {
    codigo?: string;
    mensaje?: string;
    respuesta?: Correo[];
}
