import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from "../app.component";

@Injectable({
  providedIn: 'root'
})


export class NoMenuGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('no menu');
      
      localStorage.setItem('menu','false');
      return true;
  }
  //constructor(private appC:AppComponent){}
  
}
