import { INode } from 'sim';

export class NodeView {
    private _x = 0;
    private _y = 0;

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get id(): string {
        return this._node.id;
    }

    constructor(private _node: INode) {
    }

    move(x: number, y: number): void {
        this._x = x;
        this._y = y;
    }
}