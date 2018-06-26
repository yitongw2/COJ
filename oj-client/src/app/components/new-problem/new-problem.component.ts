import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Problem } from '../../models/problem.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {

  success: boolean = false;
  submitted: boolean = false;
  newProblemForm: FormGroup;
  //newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];

  constructor(private dataService: DataService,
              public authService: AuthService) { }

  ngOnInit() {
    this.createForm();
  }

  addProblem() {
    this.submitted = true;
    let newProblem = {
      'id': 0,
      'name': this.newProblemForm.get('problemName').value,
      'desc': this.newProblemForm.get('problemDesc').value,
      'difficulty': this.newProblemForm.get('difficulty').value
    };
    this.dataService.addProblem(newProblem)
      .then(res => {
        this.success = true;
      },
      err => {
        this.success = false;
      });
    this.resetProblem();
  }

  resetProblem() {
    this.newProblemForm.get('problemName').setValue('');
    this.newProblemForm.get('problemDesc').setValue('');
    this.newProblemForm.get('difficulty').setValue('easy');
  }

  resetSubmit() {
    this.success = false;
    this.submitted = false;
    this.resetProblem();
  }

  private createForm() {
    this.newProblemForm = new FormGroup({
      problemName: new FormControl('', Validators.required),
      problemDesc: new FormControl('', Validators.required),
      difficulty: new FormControl('easy')
    });
  }
}
