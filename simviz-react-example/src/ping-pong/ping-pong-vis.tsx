import { FunctionComponent, useEffect, useState } from 'react';
import { createNetwork } from './ping-pong';
import { NetworkVis } from '@gobixm/simviz-react';
import styles from './ping-pong.module.css';
import { goldenAngleColorGenerator } from '@gobixm/simviz';
import { Grid, Typography } from '@mui/material';
import { HistoryPanel } from '../common/history-panel/history-panel';
import { TimePanel } from '../common/time-panel/time-panel';

const network = createNetwork({
    nodeArrageRadius: 200,
    nodeColorGenerator: goldenAngleColorGenerator,
    packetOptionsFactory: (_, packet) => ({
        color: packet.type === 'ping' ? '#ff0000' : '880000',
        radius: packet.type === 'ping' ? 10 : 5,
    })
});

// todo: stop
network.network.start();

export const PingPongVis: FunctionComponent = () => {
    const [timescale, setTimescale] = useState(1);
    const [time, setTime] = useState(network.timeline.logicTime);

    let interval: ReturnType<typeof setTimeout>;

    useEffect(() => {
        const tick = 100;
        interval = setInterval(() => {

            network.timeline.tick(tick / timescale);
            setTime(network.timeline.logicTime);
        }, tick);

        return () => {
            clearInterval(interval);
        };
    });
    
    const handleTimeScale = (value: number) => setTimescale(value);
    const handleTime = (value: number) => setTime(value);

    return (
        <Grid container flexDirection="column">
            <Grid container flexDirection="column">
                <Typography>You can click on Node, and Packet to view State.</Typography>
                <TimePanel timeline={network.timeline} onTime={handleTime} onTimescale={handleTimeScale}></TimePanel>
            </Grid>
            <Grid container flexDirection="row">
                <div className={styles.network}>
                    <NetworkVis timeline={network.timeline} networkView={network.networkView} height={600} width={600} timescale={timescale} time={time}></NetworkVis>
                </div>
                <HistoryPanel historyView={network.historyView} network={network.network} />
            </Grid>            
        </Grid>
    );
};