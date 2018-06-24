import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExecutorService {

  private _resultSource = new BehaviorSubject<any>({});

  constructor(private httpClient: HttpClient) { }

  execute(data) {
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

    this.httpClient.post('api/v1/execution', data, options)
      .toPromise()
      .then(res => {
        console.log(res);
        this._resultSource.next(res);
      },
      err => {
        console.log(err);
      });
  }

  getResult(): Observable<any> {
    return this._resultSource.asObservable();
  }
}
