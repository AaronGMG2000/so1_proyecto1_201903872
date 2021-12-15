import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-ram',
  templateUrl: './ram.component.html',
  styleUrls: ['./ram.component.scss'],
})
export class RamComponent implements OnInit {

  constructor(private cpuWebSocket: ApiService) { }
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: any[] = []
  labels: any[] = []
  totalram: number = 0;
  freeram: number = 0;
  useram: number = 0;
  cacheram: number = 0;

  ngOnInit(): void {
    this.cpuWebSocket.websocket('WebSocketRam').subscribe((evt) => {
      let values = JSON.parse(evt.data);
      this.totalram = values.totalram;
      this.freeram = values.freeram;
      this.useram = values.useram - values.cacheram;
      this.cacheram = values.cacheram;
      let useram_porcentaje = (this.useram  * 100) / this.totalram;
      if (this.data.length > 20) {
        this.data.shift();
        this.labels.shift();
        this.data.push(useram_porcentaje.toFixed(4));
        this.labels.push(new Date().toLocaleTimeString());
      }else{
        this.data.push(useram_porcentaje.toFixed(4));
        this.labels.push(new Date().toLocaleTimeString());
      }
      this.chart?.update();
    });
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: this.data,
      label: 'Porcentaje de Uso de Ram',
      yAxisID: 'y-axis-1',
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      fill: 'origin',
    }],
    labels: this.labels
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      x: {},
      'y-axis-0':
      {
        position: 'left',
      },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        }
      }
    },
    plugins: {
      legend: { display: true },
    }
  };

  public lineChartType: ChartType = 'line';

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

}
