import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NodeQueryResult } from '../../types/dtos';
import { NodeLabelsComponent } from '../node-labels/node-labels.component';
import { JsonStringifyPipe } from '../../util/json-stringify.pipe';

@Component({
    selector: 'app-node-table',
    templateUrl: './node-table.component.html',
    styleUrls: ['./node-table.component.scss'],
    imports: [RouterModule, JsonStringifyPipe, MatTableModule, MatButtonModule, NodeLabelsComponent],
})
export class NodeTableComponent {
    @Input() nodes: NodeQueryResult[] = [];

    displayCols = ['id', 'labels', 'value', 'actions'];
}
