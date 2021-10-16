import { HistoryView, NetworkView, NetworkViewOptions } from '@gobixm/simviz';
import { Network, NetworkHistory, Timeline, Node, randomLatencyProvider } from '@gobixm/sim';

export type Action = 'attack' | 'retreat'

interface Command {
    action: Action
}

interface NodeState {
    commands: Map<string, Action>;
    decision: Action | undefined;
}

function createSimulation(networkViewOptions: Partial<NetworkViewOptions>) {
    const timeline = new Timeline();
    const history = new NetworkHistory();
    const network = new Network(timeline, history, { latencyProvider: randomLatencyProvider(300, 600) });
    const networkView = new NetworkView(network, networkViewOptions);
    const historyView = new HistoryView(network, history);


    const general = new Node<unknown>('general', network, { subs: {} });
    const alice = new Node<NodeState>('alice', network, { commands: new Map(), decision: undefined });
    const bob = new Node<NodeState>('bob', network, { commands: new Map(), decision: undefined });
    const traitor = new Node<NodeState>('traitor', network, { commands: new Map(), decision: undefined });

    [alice, bob].forEach(node => {
        node.registerHandler<Command>('command', (packet, state) => {
            const action = packet.body.action;
            const sender = packet.metadata.sender;
            if (sender.id === general.id) {
                state.commands.set(node.id, action);
                network.nodes.filter(n => n.id !== node.id && n.id !== general.id)
                    .forEach(neigh => network.sendPacket<Command>('command', { action: action }, node, neigh));
            } else {
                state.commands.set(sender.id, action);
            }
            if (state.commands.size === network.nodes.length - 1) {
                const commands = Array.from(state.commands.values());
                state.decision = commands.filter(c => c === 'attack').length >= (network.nodes.length - 1) / 2 ? 'attack' : 'retreat';
            }
            return state;
        });
    });

    traitor.registerHandler<Command>('command', (packet, state) => {
        const action = packet.body.action === 'attack' ? 'retreat' : 'attack';
        const sender = packet.metadata.sender;
        if (sender.id === general.id) {
            state.commands.set(traitor.id, action);
            network.nodes.filter(n => n.id !== traitor.id && n.id !== general.id)
                .forEach(neigh => network.sendPacket<Command>('command', { action: action }, traitor, neigh));
        } else {
            state.commands.set(sender.id, action);
        }
        state.decision = action;
        return state;
    });

    network.registerNode(general);
    network.registerNode(alice);
    network.registerNode(bob);
    network.registerNode(traitor);

    return {
        timeline,
        history,
        network,
        networkView,
        historyView,
        sendCommand: (action: Action) => {
            network.nodes.filter(node => node.id !== general.id)
                .forEach(node => network.sendPacket<Command>('command', { action: action }, general, node));
        }
    };
}

export const simulation = createSimulation({ nodeArrageRadius: 150 });