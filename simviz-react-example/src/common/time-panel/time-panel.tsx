import { Typography, Slider } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { Time, Timeline } from '@gobixm/sim';
import styles from './time-panel.module.css';

export interface TimePanelProps {
    readonly timeline: Timeline;
    readonly onTimescale?: (value: number) => void;
    readonly onTime?: (value: Time) => void;
}

export const TimePanel: FunctionComponent<TimePanelProps> = ({ timeline, onTimescale, onTime }) => {
    const [timescale, setTimescale] = useState(1);

    let interval: ReturnType<typeof setTimeout>;

    useEffect(() => {
        const tick = 100;
        interval = setInterval(() => {
            timeline.tick(tick / timescale);
            onTime && onTime(timeline.logicTime);
        }, tick);

        return () => {
            clearInterval(interval);
        };
    });

    const timescaleChange = (_: Event, value: number | number[]) => {
        setTimescale(value as number);
        onTimescale && onTimescale(value as number);
    };

    return (
        <div className={styles.panel}>
            <Typography variant="subtitle1">You can steed up or speed down time by moving slider.</Typography>
            <Slider min={0.01} max={10} step={0.01} defaultValue={1} onChange={timescaleChange}></Slider>
        </div>
    );
};