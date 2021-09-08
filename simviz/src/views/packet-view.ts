import { Point } from './../common/primitives';
import { NodeView } from './node-view';
import { Packet, Time } from '@gobixm/sim';
import { segmentCircleIntersection } from '../common/math-utils';

export class PacketView {
    public get from(): Point {
        return this._sender.origin;
    }

    public get to(): Point {
        return this._receiver.origin;
    }

    public get origin(): Point {
        return this._origin;
    }

    public get id(): number {
        return this._packet.metadata.id;
    }

    private _origin: Point;

    constructor(
        private _packet: Packet<unknown>,
        private _sender: NodeView,
        private _receiver: NodeView
    ) {
        this._origin = _sender.origin;
    }

    public updateOrigin(time: Time): void {
        this._origin = this.calcOrigin(time);
    }

    private calcOrigin(time: Time): Point {
        const senderPoint = segmentCircleIntersection(this._sender.origin, this._sender.options.radius, this._sender.origin, this._receiver.origin) || this._sender.origin;
        const receiverPoint = segmentCircleIntersection(this._receiver.origin, this._receiver.options.radius, this._receiver.origin, this._sender.origin) || this._receiver.origin;


        const elapsed = time - this._packet.metadata.sentAt;
        const remaining = this._packet.metadata.sentAt + this._packet.metadata.latency - time;
        if (remaining === 0) {
            return receiverPoint;
        }
        const ratio = elapsed / remaining;

        const x = (senderPoint.x + receiverPoint.x * ratio) / (1 + ratio);
        const y = (senderPoint.y + receiverPoint.y * ratio) / (1 + ratio);
        return { x, y };
    }
}
