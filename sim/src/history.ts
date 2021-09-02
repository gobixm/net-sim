import { Packet } from "./packet";

export interface NetworkEvent {
    type: 'send' | 'receive';
    packet: Packet<unknown>;
    nodeState: unknown;
}

export class NetworkHistory {
    private _history: NetworkEvent[] = [];

    public get history(): readonly NetworkEvent[] {
        return this._history;
    }

    constructor(private _retention = 100) {
    }

    add(event: NetworkEvent): void {
        this._history = [...this._history, event];
        this.retain();
    }

    clear(): void {
        this.retain(0);
    }

    retain(count: number | undefined = undefined): void {
        const retainCount = count === undefined ? this._retention : count;
        const removeCount = this._history.length - retainCount;
        if (removeCount <= 0) {
            return;
        }

        this._history.splice(0, removeCount);
    }
}