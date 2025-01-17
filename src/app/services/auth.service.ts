import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of, tap } from 'rxjs';

declare global {
    interface Window {
        ENVIRONMENT?: Record<string, string>;
    }
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public readonly fcKeycloakAuthUrl: string;
    public readonly fcKeycloakClientScope: string;
    public readonly fcKeycloakClientId: string;
    public readonly fcKeycloakClientSecret: string;
    private demoUsername: string | undefined;
    private demoPassword: string | undefined;
    private usernameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    username$: Observable<string | null> = this.usernameSubject.asObservable();
    private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
    accessToken = '';
    refreshToken = '';
    expiresIn = 0;
    tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(private http: HttpClient) {
        this.fcKeycloakAuthUrl =
            window.ENVIRONMENT?.['FC_KEYCLOAK_AUTH_URL'] ||
            'http://key-server:8080/realms/gaia-x/protocol/openid-connect/token';
        this.fcKeycloakClientScope = window.ENVIRONMENT?.['FC_KEYCLOAK_CLIENT_SCOPE'] || 'gaia-x';
        this.fcKeycloakClientId = window.ENVIRONMENT?.['FC_KEYCLOAK_CLIENT_ID'] || 'federated-catalogue';
        this.fcKeycloakClientSecret = window.ENVIRONMENT?.['FC_KEYCLOAK_CLIENT_SECRET'] || 'keycloak-secret';
        this.demoUsername = window.ENVIRONMENT?.['DEMO_USERNAME'];
        this.demoPassword = window.ENVIRONMENT?.['DEMO_PASSWORD'];
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
                this.isLoggedInSubject.next(true);
                this.startTokenExpirationTimer();
            } else {
                this.refreshAccessToken();
            }
        } else if (this.demoUsername && this.demoPassword) {
            this.loginWithDemoCredentials();
        } else {
            this.logout();
        }
    }

    login(username: string, password: string): Observable<TokenResponse> {
        this.usernameSubject.next(username);

        const body = new URLSearchParams();
        body.set('scope', this.fcKeycloakClientScope);
        body.set('grant_type', 'password');
        body.set('client_id', this.fcKeycloakClientId);
        body.set('client_secret', this.fcKeycloakClientSecret);
        body.set('username', username);
        body.set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http
            .post<TokenResponse>(this.fcKeycloakAuthUrl, body.toString(), { headers })
            .pipe(
                tap((response) => {
                    this.handleTokenResponse(response);
                    this.isLoggedInSubject.next(true);
                }),
            );
    }

    loginWithDemoCredentials(): void {
        if (this.demoUsername && this.demoPassword) {
            this.login(this.demoUsername, this.demoPassword).subscribe({
                next: (response) => {
                    this.handleTokenResponse(response);
                },
                error: () => {
                    this.logout();
                },
            });
        }
    }

    handleTokenResponse(response: TokenResponse): void {
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
        if (this.tokenExpirationTimer !== null) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = setTimeout(() => {
            this.refreshAccessToken();
        }, (this.expiresIn - 60) * 1000);
    }

    refreshAccessToken(): void {
        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('client_id', this.fcKeycloakClientId);
        body.set('client_secret', this.fcKeycloakClientSecret);
        body.set('refresh_token', this.refreshToken);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        this.http
            .post<TokenResponse>(this.fcKeycloakAuthUrl, body.toString(), { headers })
            .pipe(
                tap((response) => {
                    this.handleTokenResponse(response);
                }),
                catchError(() => {
                    this.loginWithDemoCredentials();
                    return of(null);
                }),
            )
            .subscribe();
    }

    logout(): void {
        this.accessToken = '';
        this.refreshToken = '';
        this.expiresIn = 0;
        if (this.tokenExpirationTimer !== null) {
            clearTimeout(this.tokenExpirationTimer);
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        localStorage.removeItem('tokenStoredTime');
        localStorage.removeItem('username');
        this.usernameSubject.next(null);
        this.isLoggedInSubject.next(false);
    }
}
