import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})


export class ApiService {
  private webSocket: any;
  private subject: Subject<any> = new Subject<any>();

  constructor() {}

  public websocket(path: string): Observable<any> {
    this.subject = this.new_observable(path);
    return this.subject.asObservable();
  }

  new_observable(path: string) {
    this.webSocket = new WebSocket(`ws://34.125.138.211/${path}`);
    const observable = new Observable((observableVar: Observer<MessageEvent>) => {
      this.webSocket.onmessage = observableVar.next.bind(observableVar);
      this.webSocket.onerror = observableVar.error.bind(observableVar);
      this.webSocket.onclose = observableVar.complete.bind(observableVar);
      return this.webSocket.close.bind(this.webSocket);
    });

    const observer = {
      next: (data: Object) => {
        if (this.webSocket.readyState === WebSocket.OPEN) {
          this.webSocket.send(JSON.stringify(data));
        }
      },
    };

    return Subject.create(observer, observable);
  }

  setData(message: string) {
    this.webSocket.send(message);
  }
}
