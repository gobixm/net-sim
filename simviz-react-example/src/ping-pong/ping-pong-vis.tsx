import { FunctionComponent, useEffect } from 'react';
import { createNetwork } from './ping-pong';
import { NetworkVis } from '@gobixm/simviz-react';

export const PingPongVis: FunctionComponent = () => {
    const network = createNetwork({
        nodeArrageRadius: 200
    });

    useEffect(() => {
        network.network.start();

        const interval = setInterval(() => network.timeline.tick(5), 10);

        return () => {
            network.network.stop();
            clearInterval(interval);
        };
    });

    return (
        <NetworkVis timeline={network.timeline} networkView={network.networkView} height={600} width={600}></NetworkVis>
    );
};