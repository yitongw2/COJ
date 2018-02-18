import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';

const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: '',
  desc: '',
  difficulty: 'easy'
})

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  checkProblem() {
    return (this.newProblem.name.trim() !== '') 
      && (this.newProblem.desc.trim() !== '');
  }

  addProblem() {
    if (this.checkProblem()) {
      this.dataService.addProblem(this.newProblem);
      this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
    }
  }

}
