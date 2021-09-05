import { Point } from './../common/primitives';
import { NodeView } from './node-view';
import { Packet, Time } from '../../../sim/dist/src';

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
        const elapsed = time - this._packet.metadata.sentAt;
        const remaining = this._packet.metadata.sentAt + this._packet.metadata.latency - time;
        const ratio = elapsed / remaining;

        const x = (this.from.x + this.to.x * ratio) / (1 + ratio);
        const y = (this.from.y + this.to.y * ratio) / (1 + ratio);
        return { x, y };
    }
}