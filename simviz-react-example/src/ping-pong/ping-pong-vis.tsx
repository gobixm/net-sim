import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { createSimulation } from './ping-pong';
import { NetworkVis } from '@gobixm/simviz-react';
import styles from './ping-pong.module.css';
import { goldenAngleColorGenerator } from '@gobixm/simviz';
import { Grid, Typography } from '@mui/material';
import { HistoryPanel } from '../common/history-panel/history-panel';
import { TimePanel } from '../common/time-panel/time-panel';

const network = createSimulation({
    nodeArrageRadius: 200,
    nodeColorGenerator: goldenAngleColorGenerator,
    packetOptionsFactory: (_, packet) => ({
        color: packet.type === 'ping' ? '#ff0000' : '880000',
        radius: packet.type === 'ping' ? 10 : 5,
    })
});

export const PingPongVis: FunctionComponent = () => {
    const sim = useRef(network);
    const [timescale, setTimescale] = useState(1);
    const [time, setTime] = useState(sim.current.timeline.logicTime);

    useEffect(() => {
        network.network.start();

        return () => {
            network.network.stop();
        };
    });

    const handleTimeScale = (value: number) => setTimescale(value);
    const handleTime = (value: number) => setTime(value);

    return (
        <Grid container flexDirection="column">
            <Grid container flexDirection="column">
                <Typography>You can click on Node, and Packet to view State.</Typography>
                <TimePanel timeline={sim.current.timeline} onTime={handleTime} onTimescale={handleTimeScale}></TimePanel>
            </Grid>
            <Grid container flexDirection="row">
                <div className={styles.network}>
                    <NetworkVis timeline={sim.current.timeline} networkView={sim.current.networkView} height={600} width={600} timescale={timescale} time={time}></NetworkVis>
                </div>
                <HistoryPanel historyView={sim.current.historyView} network={sim.current.network} />
            </Grid>
        </Grid>
    );
};