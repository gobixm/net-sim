import { FunctionComponent, useEffect, useState } from 'react';
import { PacketView } from '@gobixm/simviz';
import { PacketStateVis } from './packet-state-vis';
import { Point } from '@gobixm/simviz';

interface PacketVisProps {
    packetView: PacketView;
}

const getTransform = (point: Point) => {
    return `translate(${point.x}, ${point.y})`;
};

export const PacketVis: FunctionComponent<PacketVisProps> = ({ packetView }) => {
    const [stateVisible, setStateVisible] = useState(false);
    const [translate, setTranslate] = useState(getTransform(packetView.from));

    useEffect(() => {
        const timeout = setTimeout(() => setTranslate(getTransform(packetView.to)), 20); //todo: transform insant bug
        return () => {
            clearTimeout(timeout);
        };

    }, []);

    const getTransition = () => {
        return `transform ${packetView.metadata.latency}ms linear`;
    };

    const toggleState = () => {
        setStateVisible(prev => !prev);
    };

    return (
        <g>
            <marker id="arrowhead" markerWidth="10" markerHeight="7"
                refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="red" />
            </marker>
            <line markerEnd="url(#arrowhead)" x1={packetView.from.x} y1={packetView.from.y} x2={packetView.to.x} y2={packetView.to.y} stroke="black" />
            <g style={{ transition: getTransition() }}
                transform={translate}
                onClick={toggleState}>
                <circle fill="blue" r="10" />
                {stateVisible && <PacketStateVis packetView={packetView} />}
            </g>
            <text fill="blue" dominantBaseline="central" textAnchor="middle" x={packetView.origin.x} y={packetView.origin.y} />
        </g>
    );
};