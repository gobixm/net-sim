import { FunctionComponent, useEffect, useRef } from 'react';
import { Action, simulation } from './simulation';

import { Box, Button } from '@mui/material';
import { PatternPage } from '../common/pattern-page/pattern-page';

export const Bgp: FunctionComponent = () => {
    const sim = useRef(simulation);

    const handleCommand = (action: Action) => sim.current.sendCommand(action);

    useEffect(() => {
        sim.current.network.start();
        return () => {
            sim.current.network.stop();
        };
    }, []);

    return (
        <PatternPage title="Byzantine Generals Problem"
            brief="General sends command to lieutenants. They will win either if majority will attack, or survive if majority is retreat. But there is one traitor who tries to mess the decision."
            historyView={sim.current.historyView}
            network={sim.current.network}
            networkView={sim.current.networkView}
            timeline={sim.current.timeline}
        >
            <Box sx={{ display: 'flex' }} alignItems="center">
                <Button sx={{ marginLeft: '10px' }} onClick={() => handleCommand('attack')}>Attack!</Button>
                <Button sx={{ marginLeft: '10px' }} onClick={() => handleCommand('retreat')}>Retreat</Button>
            </Box>
        </PatternPage>
    );
};