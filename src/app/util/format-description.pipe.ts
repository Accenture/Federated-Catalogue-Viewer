import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDescription',
    standalone: true,
    pure: true,
})
export class FormatDescriptionPipe implements PipeTransform {
    transform(value: unknown, separator = ', '): string {
        if (Array.isArray(value)) {
            return value.join(separator);
        }
        if (typeof value === 'string') {
            return value;
        }
        return '';
    }
}
