import { Point } from './../common/primitives';
import { NodeView } from './node-view';
import { Packet, PacketMetadata, Time } from '@gobixm/sim';
import { segmentCircleIntersection } from '../common/math-utils';

export interface PacketViewOptions {
    radius: number;
    color: string;
}

const defaultOptions: PacketViewOptions = {
    radius: 10,
    color: '#0000ee'
};

export class PacketView {
    public get from(): Point {
        return this._from;
    }

    public get to(): Point {
        return this._to;
    }

    public get origin(): Point {
        return this._origin;
    }

    public get id(): number {
        return this._packet.metadata.id;
    }

    public get body(): unknown {
        return this._packet.body;
    }

    public get metadata(): PacketMetadata {
        return this._packet.metadata;
    }

    public get type(): string {
        return this._packet.type;
    }

    public get options(): PacketViewOptions {
        return this._options;
    }

    private _origin: Point;
    private _from: Point;
    private _to: Point;
    private _options: PacketViewOptions;

    constructor(
        private _packet: Packet<unknown>,
        private _sender: NodeView,
        private _receiver: NodeView,
        options: Partial<PacketViewOptions> = {}
    ) {
        this._options = { ...defaultOptions, ...options };

        this._origin = _sender.origin;
        this._from = _sender.origin;
        this._to = _receiver.origin;

        this.update(_packet.metadata.sentAt);
    }

    public update(time: Time): void {
        const senderPoint = segmentCircleIntersection(this._sender.origin, this._sender.options.radius, this._sender.origin, this._receiver.origin) || this._sender.origin;
        const receiverPoint = segmentCircleIntersection(this._receiver.origin, this._receiver.options.radius, this._receiver.origin, this._sender.origin) || this._receiver.origin;

        this._from = senderPoint;
        this._to = receiverPoint;

        const elapsed = time - this._packet.metadata.sentAt;
        const remaining = this._packet.metadata.sentAt + this._packet.metadata.latency - time;
        if (remaining === 0) {
            this._origin = receiverPoint;
            return;
        }
        const ratio = elapsed / remaining;

        const x = (senderPoint.x + receiverPoint.x * ratio) / (1 + ratio);
        const y = (senderPoint.y + receiverPoint.y * ratio) / (1 + ratio);
        this._origin = { x, y };
    }
}
