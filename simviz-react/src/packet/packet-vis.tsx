import { FunctionComponent } from 'react';
import { PacketView } from '@gobixm/simviz';

interface PacketVisProps {
    packetView: PacketView;
}

export const PacketVis: FunctionComponent<PacketVisProps> = ({ packetView }) => {
    return (
        <g>
            <line x1={packetView.from.x} y1={packetView.from.y} x2={packetView.to.x} y2={packetView.to.y} stroke="black" />
            <circle fill="blue" r="10" cx={packetView.origin.x} cy={packetView.origin.y} />
            <text fill="blue" dominantBaseline="central" textAnchor="middle" x={packetView.origin.x} y={packetView.origin.y} />
        </g>
    );
};