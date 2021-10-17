
import { FunctionComponent, useEffect, useState } from 'react';
import { HistoryView, NetworkView } from '@gobixm/simviz';
import { Network, Timeline } from '@gobixm/sim';
import { NetworkVis } from '@gobixm/simviz-react';

import styles from './pattern-page.module.css';
import { TimePanel } from '../time-panel/time-panel';
import { Typography } from '@mui/material';
import { HistoryPanel } from '../history-panel/history-panel';

export interface PatternPageProps {
    readonly network: Network;
    readonly networkView: NetworkView;
    readonly historyView: HistoryView;
    readonly timeline: Timeline;
    readonly brief: string;
    readonly title: string;
}

export const PatternPage: FunctionComponent<PatternPageProps> = (props) => {
    const [timescale, setTimescale] = useState(1);
    const [time, setTime] = useState(props.timeline.logicTime);

    const handleTimeScale = (value: number) => setTimescale(value);
    const handleTime = (value: number) => setTime(value);

    useEffect(() => {
        props.network.start();
        return () => {
            props.network.stop();
        };
    }, []);

    return (
        <div className={styles.host}>
            <Typography variant="h4">{props.title}</Typography>
            <Typography variant="subtitle1" sx={{ margin: '10px 0' }}>{props.brief}</Typography>
            {props.children}
            <div className={styles.timeline}>
                <TimePanel timeline={props.timeline} onTime={handleTime} onTimescale={handleTimeScale}></TimePanel>
            </div>
            <div className={styles.visualization}>
                <NetworkVis networkView={props.networkView} height={600} width={600} timescale={timescale} time={time}></NetworkVis>
                <HistoryPanel historyView={props.historyView} network={props.network} />
            </div>
        </div>
    );
};