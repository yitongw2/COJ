import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Problem } from '../../models/problem.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

enum Status {
  Idle,
  Pending,
  Success,
  Fail,
}

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {

  STATUS = Status;
  status = Status.Idle;
  newProblemForm: FormGroup;
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];

  constructor(private dataService: DataService,
              public authService: AuthService) { }

  ngOnInit() {
    this.createForm();
  }

  addProblem() {
    this.status = Status.Pending;
    let newProblem = {
      'id': 0,
      'name': this.newProblemForm.get('problemName').value,
      'desc': this.newProblemForm.get('problemDesc').value,
      'difficulty': this.newProblemForm.get('difficulty').value
    };
    this.dataService.addProblem(newProblem)
      .then(res => {
        this.status = Status.Success;
        this.resetProblem();
      },
      err => {
        this.status = Status.Fail;
      });
  }

  get problemName() {
    return this.newProblemForm.get('problemName');
  }

  get problemDesc() {
    return this.newProblemForm.get('problemDesc');
  }

  get difficulty() {
    return this.newProblemForm.get('difficulty');
  }

  resetProblem() {
    this.newProblemForm.get('problemName').setValue('');
    this.newProblemForm.get('problemDesc').setValue('');
    this.newProblemForm.get('difficulty').setValue('easy');
  }

  resetSubmit() {
    this.status = Status.Idle;
    this.resetProblem();
  }

  private createForm() {
    this.newProblemForm = new FormGroup({
      'problemName': new FormControl('', Validators.required),
      'problemDesc': new FormControl('', Validators.required),
      'difficulty': new FormControl('easy')
    });
  }
}
