import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(){
    document.getElementById("menu-cuenta").hidden=true;
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    //document.getElementById("menu-cuenta").hidden=false;
  }

  menu_cuenta(){
    //console.log('log');
    
    // const menu_cuenta :HTMLElement = document.getElementById('menu-cuenta');
     
    if (document.getElementById("menu-cuenta").hidden==true) {
      // document.getElementById("menu-cuenta").classList.remove("animated"); //flipInX
      // document.getElementById("menu-cuenta").classList.remove("flipInX"); //flipInX
      // document.getElementById("menu-cuenta").classList.add("animated");
      // document.getElementById("menu-cuenta").classList.add("flipInX");
      document.getElementById("menu-cuenta").hidden=false;
    }
    else if (document.getElementById("menu-cuenta").hidden==false) {
      // document.getElementById("menu-cuenta").classList.remove("animated"); //flipInX
      // document.getElementById("menu-cuenta").classList.remove("flipInX"); //flipInX
      // document.getElementById("menu-cuenta").classList.add("animated");
      // document.getElementById("menu-cuenta").classList.add("flipInX");
      document.getElementById("menu-cuenta").hidden=true;
    }
    //menu_cuenta.hidden = false;
  }

}
