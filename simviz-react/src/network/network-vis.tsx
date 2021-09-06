import { FunctionComponent, useEffect, useState } from 'react';
import { NetworkView, NodeView } from 'simviz';
import { NodeVis } from '../node/node-vis';

export interface NetworkVisProps {
    readonly networkView: NetworkView;
}

interface NodesState {
    nodes: readonly NodeView[];
}

export const NetworkVis: FunctionComponent<NetworkVisProps> = ({ networkView }) => {
    const [nodesState, setNodesState] = useState<NodesState>({
        nodes: networkView.nodes
    });

    useEffect(() => {
        return () => {
            // noop
        };
    });

    return (
        <div>
            {
                nodesState.nodes.map(node =>
                    <NodeVis key={node.id} nodeView={node}>{node.id} x:{node.x} y:{node.y}</NodeVis>)
            }
        </div>
    );
};