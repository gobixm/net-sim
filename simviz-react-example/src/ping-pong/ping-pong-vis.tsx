import { FunctionComponent, useEffect, useState } from 'react';
import { createNetwork } from './ping-pong';
import { HistoryVis, NetworkVis } from '@gobixm/simviz-react';
import styles from './ping-pong.module.css';
import { goldenAngleColorGenerator } from '@gobixm/simviz';
import { Grid, Slider, Typography } from '@mui/material';

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

    const timescaleChange = (_: Event, value: number | number[]) => {
        setTimescale(value as number);
    };

    return (
        <Grid container flexDirection="column">
            <Grid container flexDirection="column">
                <Typography>You can click on Node, and Packet to view State.</Typography>
                <Typography>Timescale: {timescale}</Typography>
                <Slider min={0.01} max={10} step={0.01} defaultValue={1} onChange={timescaleChange}></Slider>
            </Grid>
            <Grid container flexDirection="row">
                <div className={styles.network}>
                    <NetworkVis timeline={network.timeline} networkView={network.networkView} height={600} width={600} timescale={timescale} time={time}></NetworkVis>
                </div>
                <div className={styles.history}>
                    <HistoryVis history={network.historyView} network={network.network} />
                </div>
            </Grid>
        </Grid>
    );
};