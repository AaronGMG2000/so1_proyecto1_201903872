import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  API_URI = 'http://34.125.138.211/';
  // API_URI = 'http://localhost:3000';


  constructor(private http: HttpClient, private router: Router) { }

  GET_USERS(): any{
    return this.http.get<any>(`${this.API_URI}`);
  }

  KILL(kill:any): any{
    return this.http.post<any>(`${this.API_URI}kill`, kill);
  }
}
