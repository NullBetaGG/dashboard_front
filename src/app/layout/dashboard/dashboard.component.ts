import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  chart!: Chart;
  jsonData: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    console.log('Canvas element:', canvas);

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
            ],
            datasets: [
              {
                label: 'Volume Mensal de Vendas',
                data: [65540, 59778, 80516, 81200, 56593, 55551, 120590],
                fill: false,
                borderColor: '#FF6600',
                tension: 0.2,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value, index, values) {
                    return 'R$ ' + value.toLocaleString('pt-BR');
                  },
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    var label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR');
                    return label;
                  },
                },
              },
            },
          },
        });
      } else {
        console.error('Failed to get context of the canvas element.');
      }
    } else {
      console.error('Failed to find the canvas element.');
    }


    this.getJsonData().subscribe(data => {
      this.jsonData = data;
      console.log(this.jsonData); // exibe o conteúdo do arquivo JSON
    });


    // Exemplo de arquivo JSON extraído do banco de dados
    let json =
      '[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}, {"id": 3, "name": "Bob"}]';

    // Analisa o JSON e converte-o em um objeto JavaScript
    let data = JSON.parse(json);

    console.log(data);
  }

  getJsonData() {
    return this.http.get('/assets/data/dados.json')
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
