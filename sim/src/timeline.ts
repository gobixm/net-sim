import { Time } from "./time";

export type TickCallback = (tick: Time) => void;
export type TickUnsubscribee = TickCallback;

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

    subscribeTick(callback: TickCallback): TickUnsubscribee {
        this._subscribers.add(callback);
        return callback;
    }

    unsubscribeTick(unsubscribee: TickUnsubscribee): void {
        this._subscribers.delete(unsubscribee);
    }
}