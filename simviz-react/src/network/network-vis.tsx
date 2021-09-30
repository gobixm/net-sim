import { FunctionComponent, useEffect, useState } from 'react';
import { NetworkView, NodeView, PacketView } from '@gobixm/simviz';
import { NodeVis } from '../node/node-vis';
import { Time, Timeline } from '@gobixm/sim';
import { PacketVis } from '../packet/packet-vis';

export interface NetworkVisProps {
    readonly height: number;
    readonly width: number;
    readonly networkView: NetworkView;
    readonly timeline: Timeline;
    readonly timescale: number;
    readonly time: Time;
}

export const NetworkVis: FunctionComponent<NetworkVisProps> = ({ timeline, networkView, height, width, timescale, time }) => {
    const [nodesState, setNodesState] = useState<readonly NodeView[]>(networkView.nodes);
    const [packetsState, setPacketsState] = useState<readonly PacketView[]>(networkView.packets);
    
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

    return (
        <svg height={height} width={width} viewBox={`${-height / 2} ${-width / 2} ${height} ${width}`}>
            {
                packetsState.map(packet =>
                    <PacketVis key={packet.id} packetView={packet} timescale={timescale} time={time} />)
            }
            {
                nodesState.map(node =>
                    <NodeVis key={node.id} nodeView={node}>{node.id} x:{node.x} y:{node.y}</NodeVis>)
            }
        </svg>
    );
};