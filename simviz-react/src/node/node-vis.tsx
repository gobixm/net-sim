import { FunctionComponent } from 'react';
import { NodeView } from 'simviz';

interface NodeVisProps {
    nodeView: NodeView;
}

export const NodeVis: FunctionComponent<NodeVisProps> = ({ nodeView }) => {
    return (
        <div>
            {nodeView.id}
        </div>
    );
};


