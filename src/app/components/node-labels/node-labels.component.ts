import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-node-labels',
    templateUrl: './node-labels.component.html',
    styleUrls: ['./node-labels.component.scss'],
    imports: [CommonModule, MatChipsModule],
})
export class NodeLabelsComponent {
    @Input() labels: string[] = [];
}
