import { FunctionComponent } from 'react';
import { NodeView } from '@gobixm/simviz';
import { defaultJsonReplacer } from '../common/json-replacer';

interface NodeStateVisProps {
    nodeView: NodeView;
}

export const NodeStateVis: FunctionComponent<NodeStateVisProps> = ({ nodeView }) => {
    return (
        <foreignObject style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            <div style={{
                display: 'inline-block',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: '4px',
                border: 'solid 1px black'
            }}>
                <pre style={{ fontSize: '13px' }}>
                    {JSON.stringify(nodeView.state, defaultJsonReplacer, 2)}
                </pre>
            </div>
        </foreignObject>
    );
};