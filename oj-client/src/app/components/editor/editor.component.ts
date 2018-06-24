import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ExecutorService } from '../../services/executor.service';
import { ActivatedRoute } from '@angular/router';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;
  sessionId: string;
  languages: string[]  = ['Java', 'Python'];
  language: string = 'Java';
  defaultContent = {
    'Java': `public class Example {
      public static void main(String[] args) {
        // Type your Java code here.
      }
    }`,
    'Python': `class Solution:
      def example():
        # write your python code here.
    `
  };

  constructor(private collaboration: CollaborationService,
              private executor: ExecutorService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();
    // initialize collaboration service
    console.log(this.route.params);
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.collaboration.init(this, this.sessionId);
      this.collaboration.restoreBuffer();
    });

    this.editor.lastAppliedChange = null;
    this.editor.on('change', diff => {
      console.log('editor changes: ' + JSON.stringify(diff));
      if (this.editor.lastAppliedChange != diff) {
        this.collaboration.change(JSON.stringify(diff));
      }
    });
  }

  setLanguage(language: string) {
    this.language = language;
    this.resetEditor();
    this.collaboration.changLang(this.language);
  }

  resetEditor() {
    this.editor.getSession().setMode('ace/mode/' + this.language.toLowerCase());
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit() {
    let data = {
      'sessionId': this.sessionId,
      'code': this.editor.getValue(),
      'lang': this.language.toLowerCase()
    };

    this.executor.execute(data);
  }
}
