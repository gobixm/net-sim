import { FunctionComponent, useEffect } from 'react';
import { createNetwork } from './ping-pong';
import { NetworkVis } from '@gobixm/simviz-react';

export const PingPongVis: FunctionComponent = () => {
    const network = createNetwork({
        nodeArrageRadius: 200
    });

    useEffect(() => {
        network.network.start();

        return () => {
            network.network.stop();
        };
    });

    return (
        <NetworkVis networkView={network.networkView} height={600} width={600}></NetworkVis>
    );
};