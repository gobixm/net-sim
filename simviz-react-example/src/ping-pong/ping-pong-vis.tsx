import { FunctionComponent, useEffect } from 'react';
import { createNetwork } from './ping-pong';
import { HistoryVis, NetworkVis } from '@gobixm/simviz-react';
import styles from './ping-pong.module.css';

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
        <div className={styles.container}>
            <div className={styles.network}>
                <NetworkVis timeline={network.timeline} networkView={network.networkView} height={600} width={600}></NetworkVis>
            </div>
            <div className={styles.history}>
                <HistoryVis history={network.historyView} network={network.network} />
            </div>
        </div>
    );
};