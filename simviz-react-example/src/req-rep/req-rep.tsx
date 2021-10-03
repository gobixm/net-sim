import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { HistoryVis, NetworkVis } from '@gobixm/simviz-react';
import { TimePanel } from '../common/time-panel/time-panel';
import { simulation } from './network';

import styles from './req-rep.module.css';
import { Box, Button, TextField, Typography } from '@mui/material';
import { HistoryPanel } from '../common/history-panel/history-panel';

export const RequestReply: FunctionComponent = () => {
    const sim = useRef(simulation);
    const [timescale, setTimescale] = useState(1);
    const [time, setTime] = useState(sim.current.timeline.logicTime);
    const wordRef = useRef<HTMLInputElement>(null);

    const handleTimeScale = (value: number) => setTimescale(value);
    const handleTime = (value: number) => setTime(value);
    const handleSend = () => sim.current.sendWord(wordRef.current?.value ?? '');

    useEffect(() => {
        sim.current.network.start();
        return () => {
            sim.current.network.stop();
        };
    }, []);

    return (
        <div className={styles.host}>
            <TimePanel timeline={sim.current.timeline} onTime={handleTime} onTimescale={handleTimeScale}></TimePanel>
            <Typography>Client sends word in request, server reverse it and sends in reply.</Typography>
            <Box sx={{ display: 'flex' }} alignItems="center"><TextField inputRef={wordRef} /><Button sx={{marginLeft: '10px'}} onClick={handleSend}>Send Word</Button></Box>
            <div className={styles.visualization}>
                <NetworkVis timeline={sim.current.timeline} networkView={sim.current.networkView} height={600} width={600} timescale={timescale} time={time}></NetworkVis>
                <HistoryPanel historyView={sim.current.historyView} network={sim.current.network} />
            </div>
        </div>
    );
};