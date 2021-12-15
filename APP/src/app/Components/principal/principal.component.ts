import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IndexService } from '../../Services/index.service';

export interface Children {
  name: string;
  pid: number;
  state: number;
  use_ram: number;
}

export interface Process {
  name: string;
  pid: number;
  user: string;
  uid: number;
  ram_usage: number;
  state_name: string;
  state: number;
  childrens: Children[];
}



@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})

export class PrincipalComponent implements AfterViewInit {
  panelOpenState = false;
  data: Process[] = [];
  users: any = {}
  ejecucion = 0;
  suspendidos = 0;
  detenidos = 0;
  zombie = 0;
  total = 0;
  displayedColumns: string[] = ['name', 'user', 'ram_usage', 'state', 'uid', 'pid', 'Kill'];
  displayedColumns2: string[] = ['name'];
  dataSource: MatTableDataSource<Process>;
  dataSource2: MatTableDataSource<Process>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('Paginator2', { read: MatPaginator })
  paginator2!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild('Paginator2', { read: MatSort })
  sort2!: MatSort;

  constructor(private cpuWebSocket: ApiService, private get_user: IndexService) {
    // Create 100 users
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource2 = new MatTableDataSource(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource.sort = this.sort;
    this.dataSource2.sort = this.sort2;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }


  ngOnInit(): void {

    this.get_user.GET_USERS().subscribe(
      (res: any) => {
        let new_data: any = {}
        let users = JSON.parse(res)
        for (let keys in users) {
          let user: number = users[keys]
          new_data[user] = keys
        }
        this.users = new_data
      },
      (err: any) => console.log(err)
    );

    this.cpuWebSocket.websocket('WebSocketCpu').subscribe((evt) => {
      this.data = [];
      this.ejecucion = 0;
      this.suspendidos = 0;
      this.detenidos = 0;
      this.zombie = 0;
      this.total = 0;
      let values = JSON.parse(evt.data);
      values.forEach((element: any) => {
        element['user'] = this.users[element.uid]
        element.ram_usage = element.ram_usage / 32109
        this.total++
        if (element.state === 0) {
          element.state_name = 'Running'
          this.ejecucion++
        } else if (element.state === 8) {
          element.state_name = 'Stopped'
          this.detenidos++

        } else if (element.state === 4) {
          element.state_name = 'Zombie'
          this.zombie++
        } else {
          element.state_name = 'Sleeping'
          this.suspendidos++
        }
        this.data.push(element);
      });
      console.log(this.data)
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource2 = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource2.paginator = this.paginator2;
      this.dataSource.sort = this.sort;
      this.dataSource2.sort = this.sort2;
    });
  }

  kill_process(pid: number) {
    let kill = {
      PID: pid.toString()
    }
    this.get_user.KILL(kill).subscribe(
      (res: any) => {
        console.log(res)
      },
      (err: any) => console.log(err)
    );
  }
}


