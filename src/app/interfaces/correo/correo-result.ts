import { Correo } from "./correo";

export interface CorreoResult {
    codigo?: string;
    mensaje?: string;
    respuesta?: Correo;
}
