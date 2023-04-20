import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [ConfirmationService],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any = '';
  display = false;
  displayMenu = true;

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = localStorage.getItem('userActive');
    this.user = this.user.slice(0, -7);
  }

  openUser() {
    this.display = true;
  }

  sair() {
    this.confirmationService.confirm({
      message: 'Deseja sair do sistema?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      },
    });
  }
}
