import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
    username: string = '';
    password: string = '';

    constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {}

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    login(): void {
        this.authService.login(this.username, this.password).subscribe({
            next: (response: any) => {
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
