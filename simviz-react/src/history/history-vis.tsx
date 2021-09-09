import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Network } from '@gobixm/sim';
import { HistoryView, NodeHistoryTimelineView, NetworkHistoryEventView } from '@gobixm/simviz';

interface HistoryVisProps {
    history: HistoryView;
    network: Network;
}

export const HistoryVis: FunctionComponent<HistoryVisProps> = ({ history, network }) => {
    const [nodes, setNodes] = useState<readonly NodeHistoryTimelineView[]>([]);
    const [events, setEvents] = useState<readonly NetworkHistoryEventView[]>([]);
    const [container, setContainer] = useState<{ width: number, height: number, x: number, y: number }>({ width: 400, height: 400, x: 0, y: 0 });

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const subscription = network.subscribePackets(() => {
            setNodes([...history.nodeTimelines]);
            setEvents([...history.events]);

            if (svgRef.current) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bbox = (svgRef?.current as any).getBBox();
                setContainer({ width: bbox.width, height: bbox.height, x: bbox.x, y: bbox.y });
            }
        });

        return () => {
            subscription();
        };
    }, []);

    return (
        <svg ref={svgRef} width={container.width} height={container.height} viewBox={`${container.x} ${container.y} ${container.width} ${container.height}`}>
            {nodes.map(node => <g key={node.id}>
                <line stroke="black" x1={node.x} y1={0} x2={node.x} y2={node.height} />
                <text textAnchor="middle" x={node.x} y={node.height + 20}>{node.id}</text>
            </g>)}
            {events.map(event =>
                <g key={event.packetMetadata.id}>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7"
                        refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="red" />
                    </marker>
                    <line markerEnd="url(#arrowhead)" stroke="black" x1={event.from.x} y1={event.from.y} x2={event.to.x} y2={event.to.y} />
                    <text textAnchor="middle" x={event.typeOrigin.x} y={event.typeOrigin.y}>{event.type}</text>
                </g>
            )}
        </svg>
    );
};
