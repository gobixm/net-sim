import { FunctionComponent } from 'react';
import { NodeView } from '@gobixm/simviz';

interface NodeStateVisProps {
    nodeView: NodeView;
}

export const NodeStateVis: FunctionComponent<NodeStateVisProps> = ({ nodeView }) => {
    return (
        <foreignObject style={{ width: '1px', height: '1px', overflow: 'visible' }}>
            <div style={{
                position: 'absolute',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: '4px',
                border: 'solid 1px black'
            }}>
                <pre style={{ fontSize: '13px' }}>
                    {JSON.stringify(nodeView.state, null, 2)}
                </pre>
            </div>
        </foreignObject>
    );
};