import { FunctionComponent } from 'react';
import { PacketView } from '@gobixm/simviz';
import { defaultJsonReplacer } from '../common/json-replacer';

interface PacketStateVisProps {
    packetView: PacketView;
}

export const PacketStateVis: FunctionComponent<PacketStateVisProps> = ({ packetView }) => {
    return (
        <foreignObject style={{ width: '100%', height: '100%' }}>
            <div style={{
                display: 'inline-block',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: '4px',
                border: 'solid 1px black'
            }}>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>
                    {packetView.type}
                </p>
                <pre style={{ fontSize: '13px' }}>
                    {JSON.stringify(packetView.body, defaultJsonReplacer, 2)}
                </pre>
            </div>
        </foreignObject>
    );
};