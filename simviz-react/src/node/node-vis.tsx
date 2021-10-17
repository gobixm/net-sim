import { FunctionComponent, useState } from 'react';
import { NodeView } from '@gobixm/simviz';

interface NodeVisProps {
    nodeView: NodeView;
    onClick: () => void;
}

export const NodeVis: FunctionComponent<NodeVisProps> = ({ nodeView, onClick }) => {
    return (
        <g transform={`translate(${nodeView.x}, ${nodeView.y})`} onClick={onClick}>
            <circle fill={nodeView.options.color} r={nodeView.options.radius} />
            <text dominantBaseline="central" textAnchor="middle">{nodeView.id}</text>
        </g>
    );
};
