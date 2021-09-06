import { FunctionComponent, useEffect, useState } from 'react';
import { NetworkView, NodeView } from '@gobixm/simviz';
import { NodeVis } from '../node/node-vis';

export interface NetworkVisProps {
    height: number;
    width: number;
    readonly networkView: NetworkView;
}

interface NodesState {
    nodes: readonly NodeView[];
}

export const NetworkVis: FunctionComponent<NetworkVisProps> = ({ networkView, height, width }) => {
    const [nodesState, setNodesState] = useState<NodesState>({
        nodes: networkView.nodes
    });

    useEffect(() => {
        return () => {
            // noop
        };
    });

    return (
        <svg height={height} width={width} viewBox={`${-height / 2} ${-width / 2} ${height} ${width}`}>
            {
                nodesState.nodes.map(node =>
                    <NodeVis key={node.id} nodeView={node}>{node.id} x:{node.x} y:{node.y}</NodeVis>)
            }
        </svg>
    );
};