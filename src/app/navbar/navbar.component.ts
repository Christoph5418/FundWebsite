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

  //sets page data and stores it into shared data
  updateCD(): void{
    this.sharedDataStore.setSharedVariable('CD')
    
    //scrolls to top of page
    window.scrollTo(0, 0);
    
    //to toggle menu box on mobile version
    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }

  }

  updateCOM(): void{
    this.sharedDataStore.setSharedVariable('COM')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateCS(): void{
    this.sharedDataStore.setSharedVariable('CS')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateE(): void{
    this.sharedDataStore.setSharedVariable('E')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateH(): void{
    this.sharedDataStore.setSharedVariable('H')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateRE(): void{
    this.sharedDataStore.setSharedVariable('RE')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateU(): void{
    this.sharedDataStore.setSharedVariable('U')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateIT(): void{
    this.sharedDataStore.setSharedVariable('IT')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateM(): void{
    this.sharedDataStore.setSharedVariable('M')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateI(): void{
    this.sharedDataStore.setSharedVariable('I')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateF(): void{
    this.sharedDataStore.setSharedVariable('F')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  updateHome(): void{
    this.sharedDataStore.setSharedVariable('HOME')
    window.scrollTo(0, 0);

  }

  updateStrategy(): void{
    this.sharedDataStore.setSharedVariable('STRATEGY')
    window.scrollTo(0, 0);

    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }
  }

  toggleMenu() {
    const menuIcon = this.elementRef.nativeElement.querySelector('#menu-icon');
    const navbar = this.elementRef.nativeElement.querySelector('.navbar');

    if (menuIcon && navbar) {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('open');
    }

  }
}
