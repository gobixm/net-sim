import { FunctionComponent, useEffect, useRef } from 'react';
import { simulation } from './simulation';

import { Box, Button } from '@mui/material';
import { PatternPage } from '../common/pattern-page/pattern-page';

export const Survey: FunctionComponent = () => {
    const sim = useRef(simulation);

    const handleSend = () => sim.current.sendSurvey();

    useEffect(() => {
        sim.current.network.start();
        return () => {
            sim.current.network.stop();
        };
    }, []);

    return (
        <PatternPage title="Survey"
            brief="Server broadcasts request to all client asking time. Clients responses with time."
            historyView={sim.current.historyView}
            network={sim.current.network}
            networkView={sim.current.networkView}
            timeline={sim.current.timeline}
        >
            <Box sx={{ display: 'flex' }} alignItems="center"><Button sx={{ marginLeft: '10px' }} onClick={handleSend}>Send Survey</Button></Box>
        </PatternPage>
    );
};