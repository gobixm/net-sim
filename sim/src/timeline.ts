import { Time } from './time';

export type TickCallback = (tick: Time) => void;
export type TickUnsubscribe = () => void;

export class Timeline {
    public get logicTime(): Time {
        return this._logicTime;
    }

    private _logicTime: Time = 0;
    private _subscribers = new Set<TickCallback>();

    tick(step: Time): void {
        this._logicTime += step;
        this._subscribers.forEach(callback => callback(this._logicTime));
    }

    subscribeTick(callback: TickCallback): TickUnsubscribe {
        this._subscribers.add(callback);
        return () => this._subscribers.delete(callback);
    }
}