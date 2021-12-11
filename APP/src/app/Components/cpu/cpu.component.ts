import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CpuComponent implements OnInit {

  constructor(private cpuWebSocket: ApiService) { }

  ngOnInit(): void {
    this.cpuWebSocket.listen('WebSocketCpu').subscribe((evt) => {
        let values = evt.data;
        console.log(JSON.parse(values))
    });
  }



}
