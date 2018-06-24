# OjClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## Development notes
* Front-end Routing
    * using @angular/router to implement routing
    * create an application-wise routing file named ***app.routes.ts*** under app folder
    * In app.routes.ts
        * import { Routes, RouterModule } from '@angular/router';
        * create Routes, which is a list of json description of a route
                    
                const routes: Routes = [
                {
                    path: '',
                    redirectTo: 'problems',
                    pathMatch: 'full'
                },
                {
                    path: 'problems',
                    component: ProblemListComponent
                },
                {
                    path: 'problems/:id',
                    component: ProblemDetailComponent
                },
                {
                    path: '**',
                    redirectTo: 'problems'
                }
                ];
        
        * path: the url match after the base url
        * redirectTo: redirect this url to another url
        * component: show this component for this url
    * in app.component.html, change the root component to 
    
                <router-outlet></router-outlet>
        this enables the root page to display components based on our router

    * when jumping from page to page (for example, problems page jumps to problem detail page), use property binding
    
                [routerLink] = "['/problems', problem.id]"
                
        since we alreay make rules for '/problems/:id', the second part of the array corresponds to the ':id'.
        
    *  On the receiving side, the component should import **ActivatedRoute** and **Params**
        * ActivateRoute needs to be injected in the constructor and has the access to the url, param and search query params. 
        * Params can be used to retrieve url params (i.e. :id) from the route
        
* Object.freeze() && Object.assign()
    * The Object.freeze() method freezes an object: that is, prevents new properties from being added to it; prevents existing properties from being removed; and prevents existing properties, or their enumerability, configurability, or writability, from being changed, it also prevents the prototype from being changed.
    * The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
