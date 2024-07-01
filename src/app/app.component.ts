import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    protected readonly toolbar = toolbar;
    username: string | null = null;
    private usernameSubscription!: Subscription;

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.usernameSubscription = this.authService.username$.subscribe((username) => {
            this.username = username;
        });

        if (this.isLoggedIn()) {
            this.username = this.authService.getUsername();
        }
    }

    ngOnDestroy(): void {
        this.usernameSubscription.unsubscribe();
    }

    getActiveClass(urlPrefix: string): string[] {
        if (this.router.url.startsWith(urlPrefix)) {
            return ['active'];
        }
        return [];
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    logout() {
        this.authService.logout();
    }
}
