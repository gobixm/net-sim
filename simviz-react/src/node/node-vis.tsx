import { FunctionComponent } from 'react';
import { NodeView } from '@gobixm/simviz';

interface NodeVisProps {
    nodeView: NodeView;
}

export const NodeVis: FunctionComponent<NodeVisProps> = ({ nodeView }) => {
    return (
        <g transform={`translate(${nodeView.x}, ${nodeView.y})`}>
            <circle fill="grey" r="50" />
            <text dominantBaseline="central" textAnchor="middle">{nodeView.id}</text>
        </g>
    );
};


