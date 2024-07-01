import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of, tap } from 'rxjs';

declare global {
    interface Window {
        ENVIRONMENT?: Record<string, string>;
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public readonly fcKeycloakAuthUrl: string;
    private usernameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    username$: Observable<string | null> = this.usernameSubject.asObservable();
    accessToken: string = '';
    refreshToken: string = '';
    expiresIn: number = 0;
    tokenExpirationTimer: any;

    constructor(private http: HttpClient) {
        this.fcKeycloakAuthUrl =
            window.ENVIRONMENT?.['FC_KEYCLOAK_AUTH_URL'] ||
            'https://keycloak.gaiax4roms.hotsprings.io/realms/gaiax4roms/protocol/openid-connect/token';
        const storedUsername = localStorage.getItem('username');
        const storedToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedExpiresIn = localStorage.getItem('tokenExpiresIn');
        const tokenStoredTime = localStorage.getItem('tokenStoredTime');
        if (storedToken && storedRefreshToken && storedExpiresIn && tokenStoredTime) {
            this.usernameSubject.next(storedUsername ?? 'unknown user');
            this.accessToken = storedToken;
            this.refreshToken = storedRefreshToken;
            const expiresIn = parseInt(storedExpiresIn);
            const storedTime = parseInt(tokenStoredTime);
            const elapsed = (Date.now() - storedTime) / 1000;
            this.expiresIn = expiresIn - elapsed;
            if (this.expiresIn > 0) {
                this.startTokenExpirationTimer();
            } else {
                this.refreshAccessToken();
            }
        }
    }

    isLoggedIn(): boolean {
        return !!this.accessToken;
    }

    login(username: string, password: string): Observable<any> {
        this.usernameSubject.next(username);
        const body = new URLSearchParams();
        body.set('scope', 'gaia-x');
        body.set('grant_type', 'password');
        body.set('client_id', 'federated-catalogue');
        body.set('client_secret', 'keycloak-secret');
        body.set('username', username);
        body.set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http.post(this.fcKeycloakAuthUrl, body.toString(), { headers });
    }

    handleTokenResponse(response: any): void {
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expiresIn = response.expires_in;
        localStorage.setItem('username', this.usernameSubject.value!);
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        localStorage.setItem('tokenExpiresIn', this.expiresIn.toString());
        localStorage.setItem('tokenStoredTime', Date.now().toString());
        this.startTokenExpirationTimer();
    }

    startTokenExpirationTimer(): void {
        clearInterval(this.tokenExpirationTimer);

        this.tokenExpirationTimer = setTimeout(() => {
            this.refreshAccessToken();
        }, (this.expiresIn - 60) * 1000);
    }

    refreshAccessToken(): void {
        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('client_id', 'federated-catalogue');
        body.set('client_secret', 'keycloak-secret');
        body.set('refresh_token', this.refreshToken);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        this.http
            .post(this.fcKeycloakAuthUrl, body.toString(), { headers })
            .pipe(
                tap((response: any) => this.handleTokenResponse(response)),
                catchError((error) => {
                    console.error('Failed to refresh token', error);
                    this.logout();
                    return of(null);
                }),
            )
            .subscribe();
    }

    getUsername(): string | null {
        return this.usernameSubject.value;
    }

    logout(): void {
        this.accessToken = '';
        this.refreshToken = '';
        this.expiresIn = 0;
        clearInterval(this.tokenExpirationTimer);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('tokenStoredTime');
        localStorage.removeItem('username');
        this.usernameSubject.next(null);
    }
}
