import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  server_url: string = 'api/v1';
  private _problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

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
    const options = { headers: new HttpHeaders(
      {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.accessToken}`
      }
    )};
    return this.httpClient.post(this.server_url + '/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
      })
      .catch(this.handleError);
  }

  deleteProblem(id: number):Promise<Problem> {
    const options = { headers: new HttpHeaders(
      {
      'Authorization': `Bearer ${this.authService.accessToken}`
      }
    )};
    return this.httpClient.delete(this.server_url + `/problems/${id}`, options)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
