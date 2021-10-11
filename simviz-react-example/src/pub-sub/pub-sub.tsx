import { FunctionComponent, useEffect, useRef } from 'react';
import { simulation } from './simulation';

import { Box, Button } from '@mui/material';
import { PatternPage } from '../common/pattern-page/pattern-page';

export const PubSub: FunctionComponent = () => {
    const sim = useRef(simulation);

    const handlePublish = () => sim.current.publish('topic');
    const handleSubscribe = (id: string) => sim.current.subscribe(id, 'topic');
    const handleUnSubscribe = (id: string) => sim.current.unsubscribe(id, 'topic');

    useEffect(() => {
        sim.current.network.start();
        return () => {
            sim.current.network.stop();
        };
    }, []);

    return (
        <PatternPage title="Publish - Subscribe"
            brief="Client subscribes to broker on certain topic. Then client makes publishes message to this topic. All subscribed clients receive this message."
            historyView={sim.current.historyView}
            network={sim.current.network}
            networkView={sim.current.networkView}
            timeline={sim.current.timeline}
        >
            <Box sx={{ display: 'flex' }} alignItems="center"><Button sx={{ marginLeft: '10px' }} onClick={handlePublish}>Publish</Button></Box>
            <Box sx={{ display: 'flex' }} alignItems="center">
                <Button sx={{ marginLeft: '10px' }} onClick={() => handleSubscribe('alice')}>Subscribe Alice</Button>
                <Button sx={{ marginLeft: '10px' }} onClick={() => handleUnSubscribe('alice')}>Unsubscribe Alice</Button>
            </Box>
            <Box sx={{ display: 'flex' }} alignItems="center">
                <Button sx={{ marginLeft: '10px' }} onClick={() => handleSubscribe('bob')}>Subscribe Bob</Button>
                <Button sx={{ marginLeft: '10px' }} onClick={() => handleUnSubscribe('bob')}>Unsubscribe Bob</Button>
            </Box>
        </PatternPage>
    );
};