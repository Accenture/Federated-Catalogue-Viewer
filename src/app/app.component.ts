import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    protected readonly toolbar = toolbar;

    constructor(private router: Router) {}
    getActiveClass(urlPrefix: string): Array<string> {
        console.log(this.router.url);
        if (this.router.url.startsWith(urlPrefix)) {
            return ['active'];
        }
        return [];
    }
}
