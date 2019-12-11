import { Component, OnInit, ViewChildren } from '@angular/core';
import { AppComponent } from "../../app.component";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private appC: AppComponent) {
    //this.appC.nomenu(false);
   }

  ngOnInit() {
    //this.appC.nomenu(false);
  }

}
