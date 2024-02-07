import { Component, ElementRef } from '@angular/core';
import { DataShareService } from '../data-share.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  constructor(private sharedDataStore: DataShareService, private router: Router, private elementRef: ElementRef) { }


  toggleMenu() {
    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }

  }
}
