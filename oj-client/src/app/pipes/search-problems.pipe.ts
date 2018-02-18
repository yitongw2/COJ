import { Pipe, PipeTransform } from '@angular/core';
import { Problem } from '../models/problem.model';

@Pipe({name: 'searchProblems'})
export class SearchProblemsPipe implements PipeTransform {
  transform(value: Problem[], by: string): Problem[] {
    if (!by) {
      return value;
    }
    let result = value.filter(problem => problem.id === +by);
    if (!result || result.length == 0) {
      result = value.filter(problem => problem.name.includes(by));
      let tmp = value.filter(problem => problem.desc.includes(by) && !result.includes(problem));
      result = result.concat(tmp);
    }
    return result;
  }
}
