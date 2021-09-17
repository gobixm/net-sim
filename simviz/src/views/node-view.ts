import { Point } from './../common/primitives';
import { INode } from '@gobixm/sim';

export interface NodeViewOptions {
    radius: number;
    color: string;
}

const defaultOptions: NodeViewOptions = {
    radius: 40,
    color: '#eeeeee'
};

export class NodeView {
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

    public get options(): NodeViewOptions {
        return this._options;
    }

    public get state(): unknown {
        return this._node.state;
    }

    private _origin: Point = { x: 0, y: 0 };
    private _options: NodeViewOptions;

    constructor(private _node: INode, options: Partial<NodeViewOptions> = {}) {
        this._options = { ...defaultOptions, ...options };
    }

    move(origin: Point): void {
        this._origin = origin;
    }
}