import { Component } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {
  title = 'dashboard_front';

  showHeader: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      this.showHeader = !(this.router.url === '/login');
    });
  }
}
