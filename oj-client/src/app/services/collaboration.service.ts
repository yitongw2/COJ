import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  collaborationSocket: any;
  private _userSource = new BehaviorSubject<String[]>([]);

  constructor(private authService: AuthService) { }

  init(editorComponent: any, sessionId: string): void {
    var queryParam = 'sessionId=' + sessionId;
    if (this.authService.isLoggedIn) {
      console.log('log in');
      queryParam += '&nickname=' + this.authService.userProfile.nickname;
    } else {
      console.log('not log in');
      queryParam += '&nickname=unknown user';
    }
    console.log('querParam @cservice : ' + queryParam);
    this.collaborationSocket = io(window.location.origin, {query: queryParam});
    this.collaborationSocket.on('userchange', (users: string[]) => {
      console.log(users);
      this._userSource.next(users);
    });

    this.collaborationSocket.on('change', delta => {
      console.log('collabration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editorComponent.editor.lastAppliedChange = delta;
      editorComponent.editor.getSession().getDocument().applyDeltas([delta]);
    });

    this.collaborationSocket.on('change-lang', lang => {
      editorComponent.language = lang;
    });

  }

  change(delta: string): void {
    this.collaborationSocket.emit("change", delta);
  }

  changLang(lang: string): void {
    this.collaborationSocket.emit("change-lang", lang);
  }

  getUsers(): Observable<String[]> {
    return this._userSource.asObservable();
  }

  restoreBuffer() {
    this.collaborationSocket.emit('restoreBuffer');
  }
}
