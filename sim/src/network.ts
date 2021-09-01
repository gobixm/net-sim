import { INode } from "./node";
import { Packet, PacketMetadata } from "./packet";
import { Time } from "./time";
import { TickUnsubscribee, Timeline } from "./timeline";

export class Network {
    private _packetCounter = 0;
    private _inflightPackets = new Map<number, Packet<unknown>>();
    private _nodes = new Map<string, INode>();
    private _tickSubscription: TickUnsubscribee | undefined = undefined;

    constructor(private _timeline: Timeline) {
    }

    start(): void {
        if (!this._tickSubscription) {
            this._tickSubscription = this._timeline.subscribeTick((tick) => this.onTick(tick));
        }
    }

    stop(): void {
        if (this._tickSubscription) {
            this._timeline.unsubscribeTick(this._tickSubscription);
        }
    }

    registerNode(node: INode): void {
        this._nodes.set(node.id, node);
    }

    unregisterNode(id: string): void {
        this._nodes.delete(id);
    }

    sendPacket<T>(type: string, body: T, sender: INode, receiver: INode): Packet<T> {
        const meta: PacketMetadata = {
            id: this._packetCounter++,
            latency: this.getLatency(),
            receiver: receiver,
            sender: sender,
            sentAt: this._timeline.time
        }

        const packet = new Packet<T>(type, body, meta);
        this.addInflight(packet);
        return packet;
    }

    private getLatency(): Time {
        const max = 500;
        const min = 50;
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    private addInflight<T>(packet: Packet<T>) {
        this._inflightPackets.set(packet.metadata.id, packet);
    }

    private removeInflight(id: number) {
        this._inflightPackets.delete(id);
    }

    private onTick(time: Time) {        
        this._inflightPackets.forEach((packet, id) => {
            if(packet.metadata.sentAt + packet.metadata.latency <= time) {
                this.onPacketReceived(packet);
                this.removeInflight(id);
            }
        });
    }

    private onPacketReceived(packet: Packet<unknown>): void {
        const node = this._nodes.get(packet.metadata.receiver.id);
        if(!node){
            return;
        }

        node.processPacket(packet);
    }
}