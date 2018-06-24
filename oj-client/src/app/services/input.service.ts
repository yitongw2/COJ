import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  private searchTerm: BehaviorSubject<String> = new BehaviorSubject<String>('');
   
  constructor() { }
  
  setSearchTerm(term: String) {
    this.searchTerm.next(term);
  }
  
  getSearchTerm(): Observable<String> {
    return this.searchTerm.asObservable();
  }
}
