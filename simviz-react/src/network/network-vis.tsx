import { FunctionComponent, useEffect, useState } from 'react';
import { NetworkView, NodeView } from '../../node_modules/simviz/dist/src/index';

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
            {nodesState.nodes.map(node => <div key={node.id}>{node.id} x:{node.x} y:{node.y}</div>)}
        </div>
    );
};