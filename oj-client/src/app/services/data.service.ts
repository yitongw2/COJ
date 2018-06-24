import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  server_url: string = 'api/v1';
  private _problemSource = new BehaviorSubject<Problem[]>([]);  

  constructor(private httpClient: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    this.httpClient.get(this.server_url + '/problems')
      .subscribe((problems: Problem[]) => {
        this._problemSource.next(problems)
      });
    return this._problemSource.asObservable();
  }  

  getProblem(id: number): Promise<Problem> {
    return this.httpClient.get(this.server_url + `/problems/${id}`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.httpClient.post(this.server_url + '/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
