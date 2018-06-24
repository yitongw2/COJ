import { Component, OnInit } from '@angular/core';
import { ExecutorService } from '../../services/executor.service'

@Component({
  selector: 'app-execution-result',
  templateUrl: './execution-result.component.html',
  styleUrls: ['./execution-result.component.css']
})
export class ExecutionResultComponent implements OnInit {

  output: any;

  constructor(private executor: ExecutorService) { }

  ngOnInit() {
    this.executor.getResult().subscribe(
      output => {
        this.output = output;
        console.log(output);
      },
      err => console.log(err)
    );
  }

}
