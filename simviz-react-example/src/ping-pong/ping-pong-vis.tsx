import { FunctionComponent, useEffect } from 'react';
import { createNetwork } from './ping-pong';
import { NetworkVis } from 'simviz-react';

export const PingPongVis: FunctionComponent = () => {
    const network = createNetwork();

    useEffect(() => {
        network.network.start();

        return () => {
            network.network.stop();
        };
    });

    return (
        <NetworkVis networkView={network.networkView}></NetworkVis>
    );
};