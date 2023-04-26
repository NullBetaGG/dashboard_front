import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  collapsed: boolean = false;
  pushRightClass: string = 'push-right';

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(public router: Router) {
    this.router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {}

  isToggled(): boolean {
    const dom: any = document.querySelector('body');
    if (dom !== null) {
      dom.classList.toggle(this.pushRightClass);
    }
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  clickMenu(menu: string) {
    this.router.navigateByUrl(menu);
  }
}
