import { FunctionComponent, useEffect, useState } from 'react';
import { createNetwork } from './ping-pong';
import { HistoryVis, NetworkVis } from '@gobixm/simviz-react';
import styles from './ping-pong.module.css';
import { goldenAngleColorGenerator } from '@gobixm/simviz';
import { Box, Container, Grid, Slider, Typography } from '@mui/material';

const network = createNetwork({
    nodeArrageRadius: 200,
    nodeColorGenerator: goldenAngleColorGenerator
});

// todo: stop
network.network.start();

export const PingPongVis: FunctionComponent = () => {
    const [tickDelay, setTickDelay] = useState(10);
    const [tickStep, setTickStep] = useState(10);

    let interval: ReturnType<typeof setTimeout>;

    useEffect(() => {
        interval = setInterval(() => network.timeline.tick(tickStep), tickDelay);

        return () => {
            clearInterval(interval);
        };
    });

    const tickDelayChange = (_: Event, value: number | number[]) => {
        setTickDelay(value as number);
        clearInterval(interval);
        interval = setInterval(() => network.timeline.tick(tickStep), value as number);
    };

    const tickStepChange = (_: Event, value: number | number[]) => {
        setTickStep(value as number);
        clearInterval(interval);
        interval = setInterval(() => network.timeline.tick(value as number), tickDelay);
    };

    return (
        <Grid container flexDirection="column">
            <Grid container flexDirection="column">
                <Typography>You can click on Node, and Packet to view State.</Typography>
                <Typography>Delay: {tickDelay}</Typography>
                <Slider min={1} max={1000} defaultValue={10} onChange={tickDelayChange} aria-label="Temperature" ></Slider>
                <Typography>Step: {tickStep}</Typography>
                <Slider min={1} max={1000} defaultValue={10} onChange={tickStepChange}></Slider>
            </Grid>
            <Grid container flexDirection="row">
                <div className={styles.network}>
                    <NetworkVis timeline={network.timeline} networkView={network.networkView} height={600} width={600}></NetworkVis>
                </div>
                <div className={styles.history}>
                    <HistoryVis history={network.historyView} network={network.network} />
                </div>

            </Grid>

        </Grid>

    );
};