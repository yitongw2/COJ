import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model'; 
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {

  problem: Problem;
  constructor(private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dataService.getProblem(+params['id'])
        .then(problem => this.problem = problem);
    });
  }

}
