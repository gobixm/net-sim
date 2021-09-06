import { Point } from './../common/primitives';
import { INode } from '@gobixm/sim';

export class NodeView {
    private _origin: Point = { x: 0, y: 0 };

    public get x(): number {
        return this._origin.x;
    }

    public get y(): number {
        return this._origin.y;
    }

    public get origin(): Point {
        return this._origin;
    }

    public get id(): string {
        return this._node.id;
    }

    constructor(private _node: INode) {
    }

    move(origin: Point): void {
        this._origin = origin;
    }
}