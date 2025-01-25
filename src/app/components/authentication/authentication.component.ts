import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit, OnDestroy {
    username = '';
    password = '';
    isLoggedIn = false;
    private loginStateSubscription?: Subscription;

    constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.loginStateSubscription = this.authService.isLoggedIn$.subscribe((status) => {
            this.isLoggedIn = status;
        });
    }

    ngOnDestroy(): void {
        this.loginStateSubscription?.unsubscribe();
    }

    login(): void {
        this.authService.login(this.username, this.password).subscribe({
            error: () => {
                this.showErrorMessage('Wrong username or password.');
            },
        });
    }

    private showErrorMessage(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
        });
    }
}
