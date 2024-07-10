import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'jsonStringify',
})
export class JsonStringifyPipe implements PipeTransform {
    transform(value: Record<string, unknown>): string {
        return JSON.stringify(value, null, 4);
    }
}
