import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { GetDataService } from 'src/app/services/get-data.service';
import * as moment from 'moment';
import { Color, ScaleType } from '@swimlane/ngx-charts';

interface FornecedorTotal {
  name: string;
  value: number;
}

interface ClienteTotal {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  chart!: Chart;
  jsonData: any;
  dataArray: any = [];
  fProduct: string = '';
  single: any[] = [];
  singleClient: any[] = [];
  yearC: number = 2022;
  monthC: number = 3;
  display: boolean = true;

  view: [number, number] = [700, 400];

  colorScheme: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#5AA454',
      '#C7B42C',
      '#AAAAAA',
      '#ff5555',
      '#545863',
      '#F96E46',
      '#E53D00',
      '#21A0A0',
      '#2F3061',
      '#BA1200',
    ],
  };

  colorScheme2: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#BA1200',
      '#343434',
      '#2F3061',
      '#21A0A0',
      '#F96E46',
      '#00E8FC',
      '#ff5555',
      '#C7B42C',
      '#ff6600',
      '#5AA454',
    ],
  };

  gradient = false;
  tooltipDisabled = false;

  constructor(private getData: GetDataService) {}

  async ngOnInit() {
    this.dataArray = await this.getData.getArray();
    for (let i = 0; i < this.dataArray.length; i++) {
      const dateString = this.dataArray[i].dt_contrato;
      const dateMoment = moment(dateString, 'YYYY-MM-DD');
      this.dataArray[i].date = dateMoment;
    }
    const arrDateFilter: Record<number, Record<number, any[]>> = {};

    this.dataArray.forEach((obj: any) => {
      const month = moment(obj.date).month();
      const year = moment(obj.date).year();

      if (!arrDateFilter[year]) {
        arrDateFilter[year] = {};
      }
      if (!arrDateFilter[year][month]) {
        arrDateFilter[year][month] = [];
      }

      arrDateFilter[year][month].push(obj);
    });
    console.log(this.dataArray);
    console.log(arrDateFilter);

    let soma = 0;
    const arrayDeSomas = [];

    for (let idx = 0; idx < 12; idx++) {
      const element = arrDateFilter[this.yearC][idx];
      if (element) {
        for (let i = 0; i < element.length; i++) {
          const obj = element[i].Quantidade;
          soma += obj;
        }
      }
      arrayDeSomas.push(soma);
      soma = 0;
    }

    this.filterF(arrDateFilter);
    this.filterC(arrDateFilter);
    this.loadChart(arrayDeSomas);
  }

  loadChart(data: number[]) {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    console.log('Canvas element:', canvas);

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const labels = [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ];
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Volume Mensal de Vendas - ' + this.yearC,
                data: data,
                backgroundColor: ['rgba(255, 102, 0, 0.2)'],
                borderColor: ['rgba(255, 102, 0, 1)'],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value, index, values) {
                    return value.toLocaleString('pt-BR') + ' T';
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
                    label += context.parsed.y.toLocaleString('pt-BR') + 'T';
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
  }

  loadTree(total: any) {
    let top10 = [];
    for (let idx = 0; idx < 9; idx++) {
      const elem = total[idx];
      top10.push(elem);
    }
    this.single = top10;
  }

  loadTreeClient(total: any) {
    let top10 = [];
    for (let idx = 0; idx < 9; idx++) {
      const elem = total[idx];
      top10.push(elem);
    }
    this.singleClient = top10;
  }

  filterF(arrDateFilter: any) {
    const fornecedorTotais: FornecedorTotal[] = [];
    for (let month = 0; month < 12; month++) {
      if (arrDateFilter[this.yearC][month]) {
        arrDateFilter[this.yearC][month].forEach((contrato: any) => {
          const fornecedorTotalIndex = fornecedorTotais.findIndex(
            (fornecedorTotal) => {
              return fornecedorTotal.name === contrato.Fornecedor;
            }
          );
          if (fornecedorTotalIndex >= 0) {
            fornecedorTotais[fornecedorTotalIndex].value += contrato.Quantidade;
          } else {
            fornecedorTotais.push({
              name: contrato.Fornecedor,
              value: contrato.Quantidade,
            });
          }
        });
      } else {
        break;
      }
    }
    console.log(fornecedorTotais);
    fornecedorTotais.sort((a, b) => b.value - a.value);
    this.loadTree(fornecedorTotais);
  }

  filterC(arrDateFilter: any) {
    const clientesTotais: ClienteTotal[] = [];
    for (let month = 0; month < 12; month++) {
      if (arrDateFilter[this.yearC][month]) {
        arrDateFilter[this.yearC][month].forEach((contrato: any) => {
          const clienteTotalIndex = clientesTotais.findIndex(
            (clienteTotal) => {
              return clienteTotal.name === contrato.Comprador;
            }
          );
          if (clienteTotalIndex >= 0) {
            clientesTotais[clienteTotalIndex].value += contrato.Quantidade;
          } else {
            clientesTotais.push({
              name: contrato.Comprador,
              value: contrato.Quantidade,
            });
          }
        });
      } else {
        break;
      }
    }
    console.log(clientesTotais);
    clientesTotais.sort((a, b) => b.value - a.value);
    this.loadTreeClient(clientesTotais);
  }

  filtered() {
    let arrayFiltrado: any = [];
    for (let i = 0; i < this.dataArray.length; i++) {
      const elem = this.dataArray[i];
      this.fProduct.toLocaleLowerCase;
      if (elem.Produto == this.fProduct) {
        arrayFiltrado.push(elem);
      }
    }
    console.log(arrayFiltrado);
  }
}
