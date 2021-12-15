import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss'],
})
export class CpuComponent implements OnInit {

  constructor(private cpuWebSocket: ApiService) { }
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: any[] = []
  labels: any[] = []
  cpuuse: number = 0;
  cpulibre: number = 0;

  ngOnInit(): void {
    this.cpuWebSocket.websocket('Cpu').subscribe((evt) => {
        let values = JSON.parse(evt.data);
        this.cpuuse = 0
        values.forEach((element: number) => {
          this.cpuuse += element
        });
        this.cpuuse = this.cpuuse / 8
        this.cpulibre = 100 - this.cpuuse;
        if (this.data.length > 20) {
          this.data.shift();
          this.labels.shift();
          this.data.push(this.cpuuse.toFixed(4));
          this.labels.push(new Date().toLocaleTimeString());
        }else{
          this.data.push(this.cpuuse.toFixed(4));
          this.labels.push(new Date().toLocaleTimeString());
        }
        this.chart?.update();
    });
  }
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: this.data,
      label: 'Porcentaje de Uso de CPU',
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
