import { ListItem } from '@mui/material';
import type { Message, MessageType } from '../../types/common';
import { useMemo } from 'react';

export function Message({
  message,
  handleMessageClicked,
}: {
  message: Message;
  handleMessageClicked: (callsign: string) => void;
}) {
  return useMemo(() => {
    const date = new Date(message.time);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const cursor = message.type === 'radio' ? 'pointer' : 'auto';

    const displayString = `[${hours}:${minutes}:${seconds}] ${message.type === 'ATC' ? '[ATC] ' : ''}${message.callsign ? message.callsign + ': ' : ''}${message.content}`;

    function handleColor(messageType: MessageType) {
      if (messageType === 'ATC') {
        return 'rgb(0, 230, 0)';
      } else if (messageType === 'system') {
        return 'yellow';
      } else if (messageType === 'self') {
        return 'rgb(37, 212, 224)';
      }
      return 'white';
    }

    return (
      <ListItem sx={{ padding: '0px' }}>
        <p
          style={{
            color: handleColor(message.type),
            marginTop: '0px',
            marginBottom: '0px',
            fontFamily: 'monospace',
            cursor: cursor,
          }}
          onClick={() => handleMessageClicked(message.callsign)}
        >
          {displayString}
        </p>
      </ListItem>
    );
  }, [message, handleMessageClicked]);
}
