import { Component, Input } from '@angular/core';
import { NodeQueryResult } from '../../types/dtos';

@Component({
    selector: 'app-node-table',
    templateUrl: './node-table.component.html',
    styleUrls: ['./node-table.component.scss'],
})
export class NodeTableComponent {
    @Input() nodes: Array<NodeQueryResult> = [];

    displayCols = ['id', 'labels', 'value', 'actions'];
}
