import { Network, NetworkHistory, Packet, INode, PacketMetadata } from '@gobixm/sim';
import { Point } from '../common/primitives';

export class NetworkHistoryEventView {
    public get packetMetadata(): Readonly<PacketMetadata> {
        return this._packet.metadata;
    }

    public get from(): Point {
        return this._from;
    }

    public get to(): Point {
        return this._to;
    }

    public get type(): string {
        return this._packet.type;
    }

    public get typeOrigin(): Point {
        return this._typeOrigin;
    }

    private _from: Point = { x: 0, y: 0 };
    private _to: Point = { x: 0, y: 0 };
    private _typeOrigin: Point = { x: 0, y: 0 };

    constructor(private _packet: Packet<unknown>) {
    }

    move(from: Point, to: Point): void {
        this._from = from;
        this._to = to;

        this._typeOrigin = {
            x: (this._from.x + this._to.x) / 2,
            y: (this._from.y + this._to.y) / 2,
        };
    }
}

export class NodeHistoryTimelineView {
    public get id(): string {
        return this._node.id;
    }


    public get x(): number {
        return this._x;
    }

    public set x(v: number) {
        this._x = v;
    }

    public get height(): number {
        return this._height;
    }

    public set height(v: number) {
        this._height = v;
    }

    private _x = 0;
    private _height = 0;

    constructor(private _node: INode) {
    }
}

export interface HistoryViewOptions {
    readonly nodeSpacing: number;
    readonly timescale: number;
}

const defaultOptions: HistoryViewOptions = {
    nodeSpacing: 200,
    timescale: 0.1
};

export class HistoryView {
    public get events(): readonly NetworkHistoryEventView[] {
        return this._networkEvents;
    }

    public get nodeTimelines(): readonly NodeHistoryTimelineView[] {
        return this._nodeTimelines;
    }

    private _nodeTimelinesMap = new Map<string, NodeHistoryTimelineView>();
    private _nodeTimelines: NodeHistoryTimelineView[] = [];
    private _networkEvents: NetworkHistoryEventView[] = [];
    private _options: HistoryViewOptions;

    private _nodesSubscription: () => void;
    private _packetsSubscription: () => void;

    constructor(
        private _network: Network,
        private _history: NetworkHistory,
        options: Partial<HistoryViewOptions> = {}
    ) {
        this._options = { ...defaultOptions, ...options };
        _network.nodes.forEach(node => this.addNodeTimeline(node));

        this._networkEvents = this.buildNetworkEvents();

        this._nodesSubscription = this.subscribeNodes();
        this._packetsSubscription = this.subscribePackets();
    }

    destroy(): void {
        this._packetsSubscription();
        this._nodesSubscription();
    }

    private subscribeNodes(): () => void {
        return this._network.subscribeNodes(event => {
            if (event.type === 'reg') {
                this.addNodeTimeline(event.node);
            }
        });
    }

    private addNodeTimeline(node: INode) {
        const view = new NodeHistoryTimelineView(node);
        this._nodeTimelines.push(view);
        this._nodeTimelinesMap.set(node.id, view);
        this.arrangeNodes();
    }

    private subscribePackets(): () => void {
        return this._network.subscribePackets(event => {
            if (event.type === 'received') {
                this._networkEvents = this.buildNetworkEvents();
            }
        });
    }

    private buildNetworkEvents(): NetworkHistoryEventView[] {
        const events = this._history.history.filter(event => event.type === 'receive')
            .map(event => new NetworkHistoryEventView(event.packet));

        this.arrangeHistory(events);
        return events;
    }

    private arrangeNodes(): void {
        this._nodeTimelines.forEach((nodeTimeline, i) => {
            nodeTimeline.x = i * this._options.nodeSpacing;
        });
    }

    private arrangeHistory(events: NetworkHistoryEventView[]): void {
        let minTime = Infinity;
        let maxTime = 0;
        events.forEach(event => {
            minTime = Math.min(minTime, event.packetMetadata.sentAt);
            maxTime = Math.max(maxTime, event.packetMetadata.sentAt + event.packetMetadata.latency);
        });

        events.forEach(event => {
            const fromPoint: Point = {
                x: this._nodeTimelinesMap.get(event.packetMetadata.sender.id)?.x ?? 0,
                y: this._options.timescale * (event.packetMetadata.sentAt - minTime)
            };

            const toPoint: Point = {
                x: this._nodeTimelinesMap.get(event.packetMetadata.receiver.id)?.x ?? 0,
                y: this._options.timescale * (event.packetMetadata.sentAt + event.packetMetadata.latency - minTime)
            };

            event.move(fromPoint, toPoint);
        });

        this._nodeTimelines.forEach(nodeTimeline => {
            nodeTimeline.height = this._options.timescale * (maxTime - minTime);
        });
    }
}