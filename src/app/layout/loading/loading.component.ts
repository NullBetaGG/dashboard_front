import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie/lib/symbols';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  options: AnimationOptions = {
    path: 'https://assets8.lottiefiles.com/packages/lf20_dwmrnyxn.json',
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  constructor() { }

  ngOnInit() {
  }

}
