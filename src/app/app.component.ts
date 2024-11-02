import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    isLoggedIn = false;
    username: string | null = null;
    private loginStateSubscription?: Subscription;
    private usernameSubscription?: Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.loginStateSubscription = this.authService.isLoggedIn$.subscribe((status) => {
            this.isLoggedIn = status;
        });

        this.usernameSubscription = this.authService.username$.subscribe((username) => {
            this.username = username;
        });
    }

    ngOnDestroy(): void {
        this.loginStateSubscription?.unsubscribe();
        this.usernameSubscription?.unsubscribe();
    }

    logout() {
        this.authService.logout();
    }
}
