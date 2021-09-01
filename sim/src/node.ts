import { Network } from './network';
import { Packet } from './packet';
export interface INode {    
    id: string;
    processPacket: (packet: Packet<unknown>) => void;
}

export type PacketHandler<TContext, TBody> = (packet: Packet<TBody>, context: TContext) => TContext;

export class Node<TContext> implements INode {
    private _handlers = new Map<string, PacketHandler<TContext, unknown>>();

    get id(): string {
        return this._id;
    }

    constructor(
        private _id: string,
        private _network: Network,
        private _context: TContext
    ) {

    }

    send<TPacket>(type: string, body: TPacket, receiver: INode): Packet<TPacket> {
        return this._network.sendPacket(type, body, this, receiver);
    }

    processPacket(packet: Packet<unknown>): void {
        const handler = this._handlers.get(packet.type)
        if (!handler) {
            return;
        }

        handler(packet, this._context);
    }

    registerHandler<TBody>(type: string, handler: PacketHandler<TContext, TBody>): void {
        this._handlers.set(type, (packet, context) => this._context = handler(<Packet<TBody>>packet, context));
    }

    unregisterHandler(type: string): void {
        this._handlers.delete(type);
    }
}