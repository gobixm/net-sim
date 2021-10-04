import { FunctionComponent, useEffect, useRef } from 'react';
import { createSimulation } from './ping-pong';

import { goldenAngleColorGenerator } from '@gobixm/simviz';
import { PatternPage } from '../common/pattern-page/pattern-page';

const simulation = createSimulation({
    nodeArrageRadius: 200,
    nodeColorGenerator: goldenAngleColorGenerator,
    packetOptionsFactory: (_, packet) => ({
        color: packet.type === 'ping' ? '#ff0000' : '880000',
        radius: packet.type === 'ping' ? 10 : 5,
    })
});

export const PingPongVis: FunctionComponent = () => {
    const sim = useRef(simulation);

    useEffect(() => {
        simulation.network.start();

        return () => {
            simulation.network.stop();
        };
    });

    return (
        <PatternPage title="Ping - Pong example"
            brief="Node sends ping to random node. Then receiver sends response, following by ping to another random node."
            historyView={sim.current.historyView}
            network={sim.current.network}
            networkView={sim.current.networkView}
            timeline={sim.current.timeline}
        >
        </PatternPage>
    );
};