import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component';

export const salir = () => {
  localStorage.clear();
  return "/login";
};

export const openDialog = (mensaje, icono, dialog) => {
  dialog.open(DialogAlertComponent, {
    width: "250px",
    data: { mensaje: mensaje, icono: icono },
  });
}

export const openSnackBar = (message, snackBar) => {
  snackBar.open(message, "Cerrar", {
    duration: 2000,
    horizontalPosition: "right",
  });
}