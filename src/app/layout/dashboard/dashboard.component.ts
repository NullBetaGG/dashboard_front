import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { GetDataService } from 'src/app/services/get-data.service';
import * as LightweightCharts from 'lightweight-charts';
import * as moment from 'moment';
import * as d3 from 'd3';

interface FornecedorTotal {
  name: string;
  value: number;
}

interface ClienteTotal {
  name: string;
  value: number;
}

interface Years {
  year: number;
  value: number;
}

interface Product {
  name: string;
  value: number;
}

interface DataNode {
  name: string;
  value: number;
}

interface TreemapNode extends d3.HierarchyRectangularNode<DataNode> {}

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
  years: Years[];
  data: any[] = [];
  colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  product: Product[] = [];
  arrDateFilter: Record<number, Record<number, any[]>> = {};

  constructor(private getData: GetDataService) {
    this.years = [
      { year: 2023, value: 2023 },
      { year: 2022, value: 2022 },
      { year: 2021, value: 2021 },
      { year: 2020, value: 2020 },
    ];

    this.product = [
      { name: '2023', value: 2023 },
      { name: '2022', value: 2022 },
      { name: '2021', value: 2021 },
      { name: '2020', value: 2020 },
    ];

    this.data = [
      {
        name: 'ADM Teste',
        children: [
          { name: 'DDG', value: 5 },
          { name: 'Soja', value: 30 },
          {
            name: 'Cargill',
            children: [
              { name: 'DDG', value: 50 },
              { name: 'Soja', value: 70 },
              { name: 'Farelo', value: 14 },
            ],
          },
        ],
      },
      {
        name: 'SJC',
        children: [
          { name: 'DDG', value: 96 },
          { name: 'Farelo', value: 10 },
        ],
      },
    ];
  }

  async ngOnInit() {
    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) {
      this.yearC = parseInt(storedYear, 10);
    } else {
      this.yearC = 2023;
    }
    this.dataArray = await this.getData.getArray();
    for (let i = 0; i < this.dataArray.length; i++) {
      const dateString = this.dataArray[i].dt_contrato;
      const dateMoment = moment(dateString, 'YYYY-MM-DD');
      this.dataArray[i].date = dateMoment;
    }

    this.dataArray.forEach((obj: any) => {
      const month = moment(obj.date).month();
      const year = moment(obj.date).year();

      if (!this.arrDateFilter[year]) {
        this.arrDateFilter[year] = {};
      }
      if (!this.arrDateFilter[year][month]) {
        this.arrDateFilter[year][month] = [];
      }

      this.arrDateFilter[year][month].push(obj);
    });
    console.log(this.dataArray);
    console.log(this.arrDateFilter);

    let soma = 0;
    const arrayDeSomas = [];

    for (let idx = 0; idx < 12; idx++) {
      const element = this.arrDateFilter[this.yearC][idx];
      if (element) {
        for (let i = 0; i < element.length; i++) {
          const obj = element[i].Quantidade;
          soma += obj;
        }
      }
      arrayDeSomas.push(soma);
      soma = 0;
    }

    this.filterF();
    this.filterC();
    this.loadChart(arrayDeSomas);
    this.filterProd();
    this.loadNested();
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

  filterF() {
    const fornecedorTotais: FornecedorTotal[] = [];
    for (let month = 0; month < 12; month++) {
      if (this.arrDateFilter[this.yearC][month]) {
        this.arrDateFilter[this.yearC][month].forEach((contrato: any) => {
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

  filterC() {
    const clientesTotais: ClienteTotal[] = [];
    for (let month = 0; month < 12; month++) {
      if (this.arrDateFilter[this.yearC][month]) {
        this.arrDateFilter[this.yearC][month].forEach((contrato: any) => {
          const clienteTotalIndex = clientesTotais.findIndex((clienteTotal) => {
            return clienteTotal.name === contrato.Comprador;
          });
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

  filterProd() {
    const produtosValores: any[] = [];

    for (let year in this.arrDateFilter) {
      for (let month in this.arrDateFilter[year]) {
        if (this.arrDateFilter[year][month]) {
          const produtos = this.arrDateFilter[year][month];
          for (let i = 0; i < produtos.length; i++) {
            const produto = produtos[i].Produto;
            const vrPreco = produtos[i].vl_preco;
            const unidade = produtos[i].Unidade;
            const momentDate = produtos[i].date;
            const date = momentDate.format('YYYY-MM-DD');
            const index = produtosValores.findIndex(
              (item: any) => item.produto === produto
            );
            if (index !== -1) {
              const dataIndex = produtosValores[index].datas.findIndex(
                (item: any) => item.date === date
              );
              if (dataIndex !== -1) {
                produtosValores[index].datas[dataIndex].somaVrPreco += vrPreco;
                produtosValores[index].datas[dataIndex].qtd += 1;
                if (vrPreco > produtosValores[index].datas[dataIndex].max) {
                  produtosValores[index].datas[dataIndex].max = vrPreco;
                }
                if (vrPreco < produtosValores[index].datas[dataIndex].min) {
                  produtosValores[index].datas[dataIndex].min = vrPreco;
                }
                produtosValores[index].datas[dataIndex].avrg =
                  produtosValores[index].datas[dataIndex].somaVrPreco /
                  produtosValores[index].datas[dataIndex].qtd;
                produtosValores[index].datas.sort(
                  (
                    a: { date: moment.MomentInput },
                    b: { date: moment.MomentInput }
                  ) => {
                    return moment(a.date).unix() - moment(b.date).unix();
                  }
                );
              } else {
                produtosValores[index].datas.push({
                  date,
                  unidade,
                  max: vrPreco,
                  min: vrPreco,
                  avrg: vrPreco,
                  qtd: 1,
                });
                produtosValores[index].datas.sort(
                  (
                    a: { date: moment.MomentInput },
                    b: { date: moment.MomentInput }
                  ) => {
                    return moment(a.date).unix() - moment(b.date).unix();
                  }
                );
              }
            } else {
              produtosValores.push({
                produto,
                datas: [
                  {
                    date,
                    unidade,
                    max: vrPreco,
                    min: vrPreco,
                    avrg: vrPreco,
                    qtd: 1,
                  },
                ],
              });
            }
          }
        }
      }
    }
    produtosValores.sort((a, b) => a.produto.localeCompare(b.produto));
    this.chartPrice(produtosValores[32].datas);
    console.log(produtosValores);
    return produtosValores;
  }

  chartPrice(data: any[] | undefined) {
    const chartElement = document.getElementById('chart');

    if (chartElement) {
      const chart = LightweightCharts.createChart(chartElement, {
        width: 700,
        height: 400,
        layout: {
          background: {
            color: '#000000',
          },
          textColor: '#333',
        },
        grid: {
          vertLines: {
            color: '#D3D3D3',
          },
          horzLines: {
            color: '#D3D3D3',
          },
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
        },
        timeScale: {
          borderColor: '#D3D3D3',
        },
      });

      const maxLine = chart.addLineSeries({
        color: '#6a0000',
      });
      const minLine = chart.addLineSeries({
        color: '#005607',
      });
      const avgLine = chart.addLineSeries({
        color: '#000b56',
      });

      const chartData = data
        ? data
            .sort((a, b) => a.time - b.time)
            .map((item) => {
              return {
                time: item.date,
                value: item.avrg,
                max: item.max,
                min: item.min,
              };
            })
        : [];

      maxLine.setData(
        chartData.map((item) => ({ time: item.time, value: item.max }))
      );
      minLine.setData(
        chartData.map((item) => ({ time: item.time, value: item.min }))
      );
      avgLine.setData(
        chartData.map((item) => ({ time: item.time, value: item.value }))
      );
    }
  }

  onYearChange() {
    localStorage.setItem('selectedYear', this.yearC.toString());
    location.reload();
  }

  onChangeProduct() {}

  loadNested() {
    const width = 600;
    const height = 400;

    const treemapLayout = d3
      .treemap()
      .size([width, height])
      .paddingOuter(0)
      .paddingInner(0);

    const root = d3
      .hierarchy<{ children: DataNode[] }>({ children: this.data })
      .sum((d: any) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    treemapLayout(root as any);

    const nodes = d3
      .select('#treeChart')
      .selectAll('div')
      .data(root.descendants() as unknown as TreemapNode[]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    nodes
      .enter()
      .append('div')
      .style('position', 'absolute')
      .style('left', (d: TreemapNode) => d.x0 + 50 + 'px')
      .style('top', (d: TreemapNode) => d.y0 + 50 + 'px')
      .style('width', (d: TreemapNode) => d.x1 - d.x0 + 'px')
      .style('height', (d: TreemapNode) => d.y1 - d.y0 + 'px')
      .style('background', (d: TreemapNode) =>
        d.parent ? colorScale(d.parent.data.name) : colorScale(d.data.name)
      )
      .text((d: TreemapNode) => (d.parent ? d.data.name : ''))
      .on('mouseover', (d: TreemapNode) => {
        const tooltip = d3.select('#tooltip');
        tooltip.style('visibility', 'visible');
        tooltip.html(`<p>${d.data.name}: ${d.data.value}</p>`);
      })
      .on('mousemove', (event: MouseEvent) => {
        const tooltip = d3.select('#tooltip');
        const [x, y] = d3.pointer(event);
        tooltip.style('top', y - 10 + 'px').style('left', x + 10 + 'px');
      })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7)
          .style('transform', 'scale(1.1)');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('transform', 'scale(1)');
      })
      .transition()
      .duration(500)
      .style('left', (d: TreemapNode) => d.x0 + 900 + 'px')
      .style('top', (d: TreemapNode) => d.y0 + 150 + 'px')
      .style('background', (d: TreemapNode) => {
        const color = d.parent
          ? colorScale(d.parent.data.name)
          : colorScale(d.data.name);
        const brightness = d.data.value / (d.parent?.value ?? 1);
        const darkerColor = d3.color(color)?.darker(brightness);
        return darkerColor ? darkerColor.toString() : null;
      });
  }
}
