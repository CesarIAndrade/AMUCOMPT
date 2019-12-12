import { Component, OnInit, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario ="" ;
  clave ="";

  constructor() {
    //this.appC.nomenu(false);
   }

  ngOnInit() {
    //this.appC.nomenu(false);
  }
  login(){
    console.log(this.usuario);
    
  }

}
