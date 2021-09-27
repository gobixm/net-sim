import { FunctionComponent, useState } from 'react';
import { NodeView } from '@gobixm/simviz';
import { NodeStateVis } from './node-state-vis';

interface NodeVisProps {
    nodeView: NodeView;
}

export const NodeVis: FunctionComponent<NodeVisProps> = ({ nodeView }) => {
    const [stateVisible, setStateVisible] = useState(false);

    const toggleState = () => {
        setStateVisible(prev => !prev);
    };

    return (
        <g transform={`translate(${nodeView.x}, ${nodeView.y})`} onClick={toggleState}>
            <circle fill={nodeView.options.color} r={nodeView.options.radius}/>
            <text dominantBaseline="central" textAnchor="middle">{nodeView.id}</text>
            <g transform={`translate(-${nodeView.options.radius}, 20)`}>
                {stateVisible && <NodeStateVis nodeView={nodeView} />}
            </g>
        </g>
    );
};
