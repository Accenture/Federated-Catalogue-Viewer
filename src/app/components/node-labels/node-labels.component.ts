import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-node-labels',
    templateUrl: './node-labels.component.html',
    styleUrls: ['./node-labels.component.scss'],
})
export class NodeLabelsComponent {
    @Input() labels: string[] = [];
}
