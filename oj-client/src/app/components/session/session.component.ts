import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  users: string[];
 
  constructor(private collaboration: CollaborationService) { }

  ngOnInit() {
    this.collaboration.userSource.subscribe(users => this.users = users);
  }

}
