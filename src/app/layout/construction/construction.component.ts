import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie/lib/symbols';

@Component({
  selector: 'app-construction',
  templateUrl: './construction.component.html',
  styleUrls: ['./construction.component.css']
})
export class ConstructionComponent implements OnInit {
  options: AnimationOptions = {
    path: 'https://assets10.lottiefiles.com/packages/lf20_AQcLsD.json',
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  currentRoute: string = '';

  constructor(private router: Router) {
    this.currentRoute = this.router.routerState.snapshot.url;
    console.log(this.currentRoute);

  }

  ngOnInit() {
  }

}
