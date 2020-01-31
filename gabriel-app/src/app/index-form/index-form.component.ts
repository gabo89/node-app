import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'index-form',
  templateUrl: './index-form.component.html',
  styleUrls: ['./index-form.component.css']
})
export class IndexFormComponent implements OnInit {
navbarOpen = false;

  constructor() { }

  ngOnInit() {
  }

 toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}
