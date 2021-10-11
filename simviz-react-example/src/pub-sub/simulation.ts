import { HistoryView, NetworkView, NetworkViewOptions } from '@gobixm/simviz';
import { Network, NetworkHistory, Timeline, Node, randomLatencyProvider } from '@gobixm/sim';

export interface Subscribe {
    topic: string
}

export interface Unsubscribe {
    topic: string
}

export interface Publish {
    message: string;
    topic: string;
}

export interface Message {
    body: string;
    topic: string;
}

interface BrokerState {
    subs: Record<string, Set<string>>;
}

function createSimulation(networkViewOptions: Partial<NetworkViewOptions>) {
    const timeline = new Timeline();
    const history = new NetworkHistory();
    const network = new Network(timeline, history, { latencyProvider: randomLatencyProvider(300, 600) });
    const networkView = new NetworkView(network, networkViewOptions);
    const historyView = new HistoryView(network, history);


    const broker = new Node<BrokerState>('broker', network, { subs: {} });
    const alice = new Node<unknown>('alice', network, undefined);
    const bob = new Node<unknown>('bob', network, undefined);
    const eve = new Node<unknown>('eve', network, undefined);

    // broker logic
    broker.registerHandler<Subscribe>('sub', (packet, state) => {
        const topic = packet.body.topic;
        const nodeId = packet.metadata.sender.id;
        if (!state.subs[topic]) {
            state.subs[topic] = new Set();
        }

        state.subs[topic].add(nodeId);

        return state;
    });

    broker.registerHandler<Unsubscribe>('unsub', (packet, state) => {
        const topic = packet.body.topic;
        const nodeId = packet.metadata.sender.id;
        if (state.subs[topic]) {
            state.subs[topic].delete(nodeId);
        }

        return state;
    });

    broker.registerHandler<Publish>('pub', (packet, state) => {
        const topic = packet.body.topic;
        const nodeIds = Array.from(state.subs[topic] ?? []);
        nodeIds.forEach(nodeId => {
            const node = network.nodes.find(x => x.id === nodeId);
            if (!node) {
                return;
            }
            network.sendPacket<Message>('msg', { topic: topic, body: packet.body.message }, broker, node);
        });

        return state;
    });

    network.registerNode(broker);
    network.registerNode(alice);
    network.registerNode(bob);
    network.registerNode(eve);

    return {
        timeline,
        history,
        network,
        networkView,
        historyView,
        publish: (topic: string) => {
            network.sendPacket<Publish>('pub', { topic: topic, message: 'the data' }, eve, broker);
        },
        subscribe: (id: string, topic: string) => {
            const node = network.nodes.find(x => x.id === id);
            if (!node) {
                return;
            }

            network.sendPacket<Subscribe>('sub', { topic: topic }, node, broker);
        },
        unsubscribe: (id: string, topic: string) => {
            const node = network.nodes.find(x => x.id === id);
            if (!node) {
                return;
            }

            network.sendPacket<Unsubscribe>('unsub', { topic: topic }, node, broker);
        }
    };
}

export const simulation = createSimulation({ nodeArrageRadius: 200 });