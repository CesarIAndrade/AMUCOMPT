import { Component, OnInit, Inject } from "@angular/core";

// Material
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-dialog-alert",
  templateUrl: "./dialog-alert.component.html",
  styleUrls: ["./dialog-alert.component.css"],
})
export class DialogAlertComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.icono == "advertencia") {
      this.rutaIcono = "../../../assets/img/panel/advertencia.png";
    } else {
      this.rutaIcono = "../../../assets/img/panel/success.png";
    }
  }

  rutaIcono: string;
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}
}
