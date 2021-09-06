import { Network, NetworkHistory, Timeline, Node } from '@gobixm/sim';
import { NetworkView, NetworkViewOptions } from '@gobixm/simviz';

interface NodeState {
    counter: number;
}

interface PingBody {
    counter: number;
}

interface PongBody {
    counter: number;
}

function addNode(id: string, network: Network): Node<NodeState> {
    const node = new Node<NodeState>(id, network, { counter: 0 });
    node.registerHandler<PongBody>('pong', (packet, state) => {
        state.counter = packet.body.counter + 1;

        const otherNodes = network.nodes.filter(n => n.id !== node.id);
        const receiver = otherNodes[Math.floor(Math.random() * otherNodes.length)];
        node.send('ping', { counter: state.counter } as PingBody, receiver);
        return state;
    });
    network.registerNode(node);
    return node;
}

export function createNetwork(networkViewOptions: NetworkViewOptions): {
    timeline: Timeline;
    history: NetworkHistory;
    network: Network;
    networkView: NetworkView;
} {
    const timeline = new Timeline();
    const history = new NetworkHistory();
    const network = new Network(timeline, history);
    const networkView = new NetworkView(network, networkViewOptions);

    addNode('alice', network);
    addNode('bob', network);
    addNode('eve', network);

    return {
        timeline,
        history,
        network,
        networkView
    };
}