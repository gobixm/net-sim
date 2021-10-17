import { FunctionComponent, useEffect, useState } from 'react';
import { NetworkView, NodeView, PacketView } from '@gobixm/simviz';
import { NodeVis } from '../node/node-vis';
import { Time, Timeline } from '@gobixm/sim';
import { PacketVis } from '../packet/packet-vis';
import { NodeStateVis } from '../node/node-state-vis';

export interface NetworkVisProps {
    readonly height: number;
    readonly width: number;
    readonly networkView: NetworkView;
    readonly timescale: number;
    readonly time: Time;
}

export const NetworkVis: FunctionComponent<NetworkVisProps> = ({ networkView, height, width, timescale, time }) => {
    const [nodesState, setNodesState] = useState<readonly NodeView[]>(networkView.nodes);
    const [packetsState, setPacketsState] = useState<readonly PacketView[]>(networkView.packets);
    const [visibleNodeStates, setVisibleNodeStates] = useState<NodeView[]>([]);

    useEffect(() => {
        const nodesSubscription = networkView.subscribeNodes(() => setNodesState([...networkView.nodes]));
        const packetsSubscription = networkView.subscribePackets(() => {
            setPacketsState([...networkView.packets]);
        });

        return () => {
            nodesSubscription();
            packetsSubscription();
        };
    }, []);

    const handleNodeClick = (node: NodeView) => {
        if (visibleNodeStates.find(x => x.id === node.id)) {
            setVisibleNodeStates([...visibleNodeStates.filter(x => x.id !== node.id)]);
        } else {
            setVisibleNodeStates([...visibleNodeStates, node]);
        }
    };

    return (
        <svg height={height} width={width} viewBox={`${-height / 2} ${-width / 2} ${height} ${width}`} style={{ overflow: 'visible' }}>
            {
                nodesState.map(node =>
                    <NodeVis key={node.id} nodeView={node} onClick={() => handleNodeClick(node)} />
                )
            }
            {
                visibleNodeStates.map(node =>
                    <g transform={`translate(${node.x - node.options.radius}, ${node.y + 20})`}>
                        <NodeStateVis nodeView={node}/>
                    </g>)
            }
            {
                packetsState.map(packet =>
                    <PacketVis key={packet.id} packetView={packet} timescale={timescale} time={time} />)
            }
        </svg>
    );
};