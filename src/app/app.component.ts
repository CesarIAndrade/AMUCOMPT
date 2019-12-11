import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  menu:string='true'; 

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  title = 'test-app';

  constructor(private breakpointObserver: BreakpointObserver) { 
    this.menu  = localStorage.getItem('menu');
    // if (localStorage.getItem('menu')!=null || localStorage.getItem('menu')=='false') {
    //   this.menu = localStorage.getItem('menu');
    //   localStorage.setItem('menu','true');
    // }
  }


}
