import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { PacketView } from '@gobixm/simviz';
import { PacketStateVis } from './packet-state-vis';
import { Time } from '@gobixm/sim';

interface PacketVisProps {
    packetView: PacketView;
    timescale: number;
    time: Time;
}

const getTransition = (timescale: number, time: Time, packetView: PacketView) => {
    const remaining = packetView.metadata.latency - time + packetView.metadata.sentAt;
    return `transform ${remaining * timescale}ms linear`;
};

export const PacketVis: FunctionComponent<PacketVisProps> = ({ packetView, timescale, time }) => {
    const [stateVisible, setStateVisible] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        const element = (ref.current as unknown as HTMLElement);
        element.style.setProperty('transform', `matrix(1, 0, 0, 1, ${packetView.from.x}, ${packetView.from.y})`);
    }, []);

    useEffect(() => {
        const element = (ref.current as unknown as HTMLElement);

        element.style.setProperty('transform', window.getComputedStyle(ref.current as unknown as Element).getPropertyValue('transform'));

        window.requestAnimationFrame(() => {
            element.style.setProperty('transition', getTransition(timescale, time, packetView));
            element.style.setProperty('transform', `matrix(1, 0, 0, 1, ${packetView.to.x}, ${packetView.to.y})`);
        });
    }, [timescale]);


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
            <g ref={ref} onClick={toggleState}>
                <circle fill={packetView.options.color} r={packetView.options.radius} />
                {stateVisible && <PacketStateVis packetView={packetView} />}
            </g>
            <text fill="blue" dominantBaseline="central" textAnchor="middle" x={packetView.origin.x} y={packetView.origin.y} />
        </g>
    );
};