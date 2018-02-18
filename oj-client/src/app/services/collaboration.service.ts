import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var io: any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  userSource = new BehaviorSubject<string[]>([]);

  constructor() { }

  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});

    this.collaborationSocket.on("change", (delta: string) => {
      console.log('collabration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });
    
    this.collaborationSocket.on("userchange", (users: string[]) => {
      Promise.all(users).then(user => {
        this.userSource.next(user);
      });
    });
  }

  // emit event to make changes and inform server and other collaborators
  change(delta: string): void {
    this.collaborationSocket.emit("change", delta);
  }
}
