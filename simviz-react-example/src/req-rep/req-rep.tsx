import { FunctionComponent, useEffect, useRef } from 'react';
import { simulation } from './network';

import { Box, Button, TextField } from '@mui/material';
import { PatternPage } from '../common/pattern-page/pattern-page';

export const RequestReply: FunctionComponent = () => {
    const sim = useRef(simulation);
    const wordRef = useRef<HTMLInputElement>(null);

    const handleSend = () => sim.current.sendWord(wordRef.current?.value ?? '');

    useEffect(() => {
        sim.current.network.start();
        return () => {
            sim.current.network.stop();
        };
    }, []);

    return (
        <PatternPage title="Request - Reply"
            brief="Client sends word in request, server reverse it and sends in reply."
            historyView={sim.current.historyView}
            network={sim.current.network}
            networkView={sim.current.networkView}
            timeline={sim.current.timeline}
        >
            <Box sx={{ display: 'flex' }} alignItems="center"><TextField inputRef={wordRef} defaultValue="foo bar" /><Button sx={{ marginLeft: '10px' }} onClick={handleSend}>Send Word</Button></Box>
        </PatternPage>
    );
};