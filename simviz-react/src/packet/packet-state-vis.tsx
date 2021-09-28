import { FunctionComponent } from 'react';
import { PacketView } from '@gobixm/simviz';

interface PacketStateVisProps {
    packetView: PacketView;
}

export const PacketStateVis: FunctionComponent<PacketStateVisProps> = ({ packetView }) => {
    return (
        <foreignObject style={{ width: '1px', height: '1px', overflow: 'visible' }}>
            <div style={{
                position: 'absolute',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: '4px',
                border: 'solid 1px black'
            }}>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>
                    {packetView.type}
                </p>
                <pre style={{ fontSize: '13px' }}>
                    {JSON.stringify(packetView.body, null, 2)}
                </pre>
            </div>
        </foreignObject>
    );
};