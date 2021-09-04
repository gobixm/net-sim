import { Time } from './time';

export type TickCallback = (tick: Time) => void;
export type TickUnsubscribe = () => void;

export class Timeline {
    public get time(): Time {
        return this._currentTime;
    }

    private _currentTime: Time = 0;
    private _subscribers = new Set<TickCallback>();

    tick(duration: Time): void {
        this._currentTime += duration;
        this._subscribers.forEach(callback => callback(this._currentTime));
    }

    subscribeTick(callback: TickCallback): TickUnsubscribe {
        this._subscribers.add(callback);
        return () => this._subscribers.delete(callback);
    }
}