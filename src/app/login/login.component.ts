import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [ MessageService ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private messageService: MessageService) { }

  ngOnInit() {
  }

  validate() {
    console.log(this.email);
    console.log(this.password);

    if (!this.email && this.password) {
      alert('Insira um e-mail!')
    } else if (!this.password && this.email) {
      alert('Insira a senha!')
    } else if (this.password && this.email) {
      const loginResult = this.authService.login(this.email, this.password);
      if (loginResult) {
        this.messageService.add({severity:'success', summary:'Bem vindo!', detail:'Login realizado com sucesso!', life: 2000});
      } else {
        this.messageService.add({severity:'error', summary:'Atenção!', detail:'Senha incorreta!', life: 2000});
      }
    }
  }
}
