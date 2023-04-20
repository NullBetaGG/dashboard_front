import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  user: string,
  password: string,
  admin: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    {user: 'jose@germinareagro.com.br', password: 'jojo23', admin: true},
    {user: 'fabio@germinareagro.com.br', password: 'fabio91', admin: true},
    {user: 'silvio@germinareagro.com.br', password: 'silvio13', admin: false},
    {user: 'thais@germinareagro.com.br', password: 'thais34', admin: false}
  ];

  constructor(private router: Router) { }

  login(email: string, password: string): boolean {
    for (let i = 0; i < this.users.length; i++) {
      const element = this.users[i];
      if (element.user === email && element.password === password) {
        const token = 'myAuthToken';
        localStorage.setItem('authToken', token);
        localStorage.setItem('userActive', email);
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl) {
          localStorage.removeItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/dash']);
        }
        return true;
      } else if (element.user === email && element.password !== password) {
        return false;
      }
    }
    return false;
  }
}
