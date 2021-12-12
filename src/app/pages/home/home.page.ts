import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html'
})
export class HomePage implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

}
