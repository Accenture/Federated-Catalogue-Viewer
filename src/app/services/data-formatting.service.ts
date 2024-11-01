import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DataFormattingService {
    formatDescription(description: string[] | undefined): string {
        return Array.isArray(description) ? description.join(', ') : '';
    }
}
