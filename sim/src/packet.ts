import { Time } from './time';
import { INode } from "./node"

export interface PacketMetadata {
    id: number,
    sender: INode,
    receiver: INode,
    sentAt: Time,
    latency: Time
}

export class Packet<T> {
    public get body(): T {
        return this._body;
    }

    public get metadata(): PacketMetadata {
        return this._metadata;
    }

    public get type(): string {
        return this._type;
    }

    constructor(
        private _type: string,
        private _body: T,
        private _metadata: PacketMetadata
    ) {
    }
}