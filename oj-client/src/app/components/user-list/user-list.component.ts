import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: String[];
  usersSubscription: Subscription; 
  constructor(private collaboration: CollaborationService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.usersSubscription = this.collaboration.getUsers().subscribe(
      users => this.users = users
    );
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }
}
