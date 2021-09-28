import { FunctionComponent, useEffect, useState } from 'react';
import { NetworkView, NodeView, PacketView } from '@gobixm/simviz';
import { NodeVis } from '../node/node-vis';
import { Timeline } from '@gobixm/sim';
import { PacketVis } from '../packet/packet-vis';

export interface NetworkVisProps {
    height: number;
    width: number;
    readonly networkView: NetworkView;
    readonly timeline: Timeline;
}

export const NetworkVis: FunctionComponent<NetworkVisProps> = ({ timeline, networkView, height, width }) => {
    const [nodesState, setNodesState] = useState<readonly NodeView[]>(networkView.nodes);
    const [packetsState, setPacketsState] = useState<readonly PacketView[]>(networkView.packets);

    useEffect(() => {
        const tickSubscription = timeline.subscribeTick(time => {
            setNodesState([...networkView.nodes]);
            networkView.packets.forEach(packetView => packetView.update(time));
            setPacketsState([...networkView.packets]);
        });
        return () => {
            tickSubscription();
        };
    }, []);

    return (
        <svg height={height} width={width} viewBox={`${-height / 2} ${-width / 2} ${height} ${width}`}>
            {
                packetsState.map(packet =>
                    <PacketVis key={packet.id} packetView={packet} />)
            }
            {
                nodesState.map(node =>
                    <NodeVis key={node.id} nodeView={node}>{node.id} x:{node.x} y:{node.y}</NodeVis>)
            }
        </svg>
    );
};