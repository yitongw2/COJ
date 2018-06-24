import { Pipe, PipeTransform } from '@angular/core';
import { Problem } from '../models/problem.model';

// The @Pipe decorator allows you to define the pipe name that you'll use within template expressions. It must be a valid JavaScript identifier. Your pipe's name is exponentialStrength.
@Pipe({
  name: 'searchProblems'
})
export class SearchProblemsPipe implements PipeTransform {

  transform(value: Problem[], term: string): Problem[] {
    if (!term) {
      return value;
    }
    let result = value.filter(problem => problem.id === +term);
    if (!result || result.length == 0) {
      result = value.filter(problem => problem.name.includes(term.toLowerCase()));
      let tmp = value.filter(problem => problem.desc.includes(term.toLowerCase()) && !result.includes(problem));
      result = result.concat(tmp);
    }
    return result;
  }

}
