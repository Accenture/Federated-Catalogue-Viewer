import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, TokenResponse } from 'src/app/services/auth.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
    username = '';
    password = '';

    constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    login(): void {
        this.authService.login(this.username, this.password).subscribe({
            next: (response: TokenResponse) => {
                this.authService.handleTokenResponse(response);
            },
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
