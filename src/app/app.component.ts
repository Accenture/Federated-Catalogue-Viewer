import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        RouterOutlet,
        MatToolbarModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatIconButton,
        AuthenticationComponent,
    ],
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
