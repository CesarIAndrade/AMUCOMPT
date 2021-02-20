import { Component, Inject } from "@angular/core";

// Material
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";

@Component({
  selector: "comunidades-bottom-sheet",
  templateUrl: "comunidades-bottom-sheet.html",
})
export class ComunidadesBottomSheet {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ComunidadesBottomSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {}

  openLink(): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
