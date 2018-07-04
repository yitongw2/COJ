import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
import { InputService } from '../../services/input.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  problems: Problem[];
  searchTerm: String;
  searchTermSubscription: Subscription;
  problemsSubscription: Subscription;

  constructor(private dataService: DataService,
              private inputService: InputService,
              public authService: AuthService) { }

  ngOnInit() {
    this.getProblems();
    this.searchTermSubscription = this.inputService.getSearchTerm()
	   .subscribe(term => this.searchTerm = term);
  }

  getProblems() {
    this.problemsSubscription = this.dataService.getProblems()
      .subscribe(problems => this.problems = problems);
  }

  deleteProblem(id) {
    this.dataService.deleteProblem(id);
    this.getProblems();
  }

  ngOnDestroy() {
    this.searchTermSubscription.unsubscribe();
  }
};
