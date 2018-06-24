import { Component, OnInit } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormControl }  from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';

// debounceTime is not common operator, so it needs to be imported seperately
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Tracks the value and validation status of an individual form control.
  // Angular has to use the formControlName directive from the ReactiveFormsModule, so we need to include ReactiveFormsModule into imports in app.module.ts 
  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(private inputService: InputService,
              public authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.searchBox.valueChanges // Emits an event every time the value of the control changes, valueChanges is an Observable
	.debounceTime(200) // react to the action only when 200 seconds has passed
	.subscribe( // subscribing an observable = executing the observable (read the observable and do something)
	  term => {this.inputService.setSearchTerm(term);}	
	);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
