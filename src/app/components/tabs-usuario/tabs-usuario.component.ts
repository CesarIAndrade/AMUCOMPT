import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs-usuario',
  templateUrl: './tabs-usuario.component.html',
  styleUrls: ['./tabs-usuario.component.css']
})
export class TabsUsuarioComponent implements OnInit {

  constructor(private router: Router
  ) { }
  
  tabIndex = 0;
  disabled = false;

  changeTabIndex(index) {
    this.tabIndex += index;
    console.log(this.tabIndex);
  }

  verifyTabIndex(index: number) {
    if (index == 0) {
      this.tabIndex = 0;
    }
    else if (index == 1) {
      this.tabIndex = 1;
    }
    else if (index == 2) {
      this.tabIndex = 2;
    }
  }

  ngOnInit() {
    if (this.router.url == '/inicio/personas') {
      this.disabled = true;
    }
  }
}
