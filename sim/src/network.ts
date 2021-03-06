import { NetworkHistory } from './history';
import { INode } from './node';
import { Packet, PacketMetadata } from './packet';
import { Time } from './time';
import { TickUnsubscribe, Timeline } from './timeline';
import { deepClone } from './utils';

export type NetworkNodeEventType = 'reg' | 'unreg';
export type NetworkNodeCallback = (event: NetworkNodeEvent) => void;

export type NetworkPacketEventType = 'sent' | 'received';
export type NetworkPacketCallback = (event: NetworkPacketEvent) => void;

export interface NetworkNodeEvent {
    type: NetworkNodeEventType;
    node: INode;
}

export interface NetworkPacketEvent {
    type: NetworkPacketEventType;
    packet: Packet<unknown>;
}

interface NetworkOptions {
    latencyProvider: (network: Network) => Time;
}

interface PendingPacket {
    packet: Packet<unknown>;
    senderState: unknown;
}

export function constantLatencyProvider(latency: Time): (network: Network) => Time {
    return () => latency;
}

export function randomLatencyProvider(min: Time, max: Time): (network: Network) => Time {
    return () => Math.random() * (max - min) + min;
}

const defaultOptions: NetworkOptions = {
    latencyProvider: constantLatencyProvider(500)
};

export class Network {
    public get nodes(): readonly INode[] {
        return Array.from(this._nodes.values());
    }

    private _packetCounter = 0;
    private _inflightPackets = new Map<number, Packet<unknown>>();
    private _pendingPackets: PendingPacket[] = [];
    private _nodes = new Map<string, INode>();
    private _tickUnsubscribe: TickUnsubscribe | undefined = undefined;
    private _options: NetworkOptions;

    private _nodesSubscriptions = new Set<(event: NetworkNodeEvent) => void>();
    private _packetsSubscriptions = new Set<(event: NetworkPacketEvent) => void>();

    constructor(
        private _timeline: Timeline,
        private _history: NetworkHistory,
        options: Partial<NetworkOptions> = {}) {
        this._options = { ...defaultOptions, ...options };
    }

    start(): void {
        if (!this._tickUnsubscribe) {
            this._tickUnsubscribe = this._timeline.subscribeTick((tick) => this.onTick(tick));
        }
    }

    stop(): void {
        if (this._tickUnsubscribe) {
            this._tickUnsubscribe();
            this._tickUnsubscribe = undefined;
        }
    }

    registerNode(node: INode): void {
        this._nodes.set(node.id, node);
        this.notifyNode('reg', node);
    }

    unregisterNode(id: string): void {
        const node = this._nodes.get(id);
        if (!node) {
            return;
        }

        this._nodes.delete(id);
        this.notifyNode('unreg', node);
    }

    sendPacket<T>(type: string, body: T, sender: INode, receiver: INode, latency: Time | undefined = undefined, delay: Time | undefined = undefined): Packet<T> {
        const meta: PacketMetadata = {
            id: this._packetCounter++,
            latency: latency === undefined ? this.getLatency() : latency,
            receiver: receiver,
            sender: sender,
            sentAt: this._timeline.logicTime + (delay ?? 0)
        };

        const packet = new Packet<T>(type, body, meta);

        if (delay) {
            this._pendingPackets = [
                ...this._pendingPackets,
                <PendingPacket>{
                    packet: packet,
                    senderState: deepClone(sender.state)
                }].sort((a, b) => a.packet.metadata.sentAt - b.packet.metadata.sentAt);
            return packet;
        }

        this.addInflight(packet);
        this._history.add({
            type: 'send',
            packet: packet,
            nodeState: deepClone(sender.state)
        });
        this.notifyPacket('sent', packet);
        return packet;
    }

    sendBroadcastPacket<T>(type: string, body: T, sender: INode, latency: Time | undefined = undefined, delay: Time | undefined = undefined): Packet<T>[] {
        return Array.from(this._nodes.values())
            .filter(node => node.id !== sender.id)
            .map(node => this.sendPacket<T>(type, body, sender, node, latency, delay));
    }

    subscribeNodes(callback: NetworkNodeCallback): () => void {
        this._nodesSubscriptions.add(callback);
        return () => this._nodesSubscriptions.delete(callback);
    }

    subscribePackets(callback: NetworkPacketCallback): () => void {
        this._packetsSubscriptions.add(callback);
        return () => this._packetsSubscriptions.delete(callback);
    }

    private getLatency(): Time {
        return this._options.latencyProvider(this);
    }

    private addInflight<T>(packet: Packet<T>) {
        this._inflightPackets.set(packet.metadata.id, packet);
    }

    private removeInflight(id: number) {
        this._inflightPackets.delete(id);
    }

    private onTick(time: Time) {
        this._pendingPackets.forEach(pending => {
            if (pending.packet.metadata.sentAt <= time) {
                this.addInflight(pending.packet);
                this._history.add({
                    type: 'send',
                    packet: pending.packet,
                    nodeState: pending.senderState
                });
                this.notifyPacket('sent', pending.packet);
            }
        });

        this._pendingPackets = this._pendingPackets.filter(x => x.packet.metadata.sentAt > time);

        this._inflightPackets.forEach((packet, id) => {
            if (packet.metadata.sentAt + packet.metadata.latency <= time) {
                this.onPacketReceived(packet);
                this.removeInflight(id);
                this.notifyPacket('received', packet);
            }
        });
    }

    private onPacketReceived(packet: Packet<unknown>): void {
        const node = this._nodes.get(packet.metadata.receiver.id);
        if (!node) {
            return;
        }

        node.processPacket(packet);

        this._history.add({
            type: 'receive',
            packet: packet,
            nodeState: deepClone(node.state)
        });
    }

    private notifyPacket(event: NetworkPacketEventType, packet: Packet<unknown>) {
        this._packetsSubscriptions.forEach(callback => callback({
            type: event,
            packet: packet
        }));
    }

    private notifyNode(event: NetworkNodeEventType, node: INode) {
        this._nodesSubscriptions.forEach(callback => callback({
            type: event,
            node: node
        }));
    }
}