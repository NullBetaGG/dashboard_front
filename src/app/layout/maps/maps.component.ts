import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  conteudoHtml: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.http
    //   .get('/assets/data/mapa_armazens_MG.html', { responseType: 'text' })
    //   .subscribe((data) => {
    //     this.conteudoHtml = data;
    //   });
  }
}
