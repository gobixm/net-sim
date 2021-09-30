import { Network } from './network';
import { Packet } from './packet';
import { Time } from './time';
export interface INode {
    id: string;
    processPacket: (packet: Packet<unknown>) => void;
    state: unknown;
}

export type PacketHandler<TContext, TBody> = (packet: Packet<TBody>, context: TContext) => TContext;

export class Node<TState> implements INode {
    private _handlers = new Map<string, PacketHandler<TState, unknown>>();

    get id(): string {
        return this._id;
    }

    get state(): TState {
        return this._state;
    }

    constructor(
        private _id: string,
        private _network: Network,
        private _state: TState
    ) {

    }

    send<TPacket>(type: string, body: TPacket, receiver: INode, latency: Time | undefined = undefined, delay: Time | undefined = undefined): Packet<TPacket> {
        return this._network.sendPacket(type, body, this, receiver, latency, delay);
    }

    processPacket(packet: Packet<unknown>): void {
        const handler = this._handlers.get(packet.type);
        if (!handler) {
            return;
        }

        handler(packet, this._state);
    }

    registerHandler<TBody>(type: string, handler: PacketHandler<TState, TBody>): void {
        this._handlers.set(type, (packet, context) => this._state = handler(<Packet<TBody>>packet, context));
    }

    unregisterHandler(type: string): void {
        this._handlers.delete(type);
    }
}