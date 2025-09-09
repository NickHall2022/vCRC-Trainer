import { useEffect, useMemo, useRef, type RefObject } from 'react';
import Draggable from 'react-draggable';
import { useMessages } from '../../hooks/useMessages';
import List from '@mui/material/List';
import { Resizable } from 're-resizable';
import { Message } from './Message';
import { useSimulation } from '../../hooks/useSimulation';

export function MessageWindow() {
  const draggableRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLLIElement>(null);

  const { messages } = useMessages();
  const { completeRequest } = useSimulation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return useMemo(() => {
    function handleMessageClicked(callsign: string) {
      completeRequest(callsign);
    }

    function createMessageDisplay() {
      return (
        <>
          {messages.map((message) => {
            return (
              <div key={message.id}>
                <Message message={message} handleMessageClicked={handleMessageClicked}></Message>
              </div>
            );
          })}
        </>
      );
    }

    return (
      <Draggable
        nodeRef={draggableRef as RefObject<HTMLDivElement>}
        allowAnyClick={true}
        handle=".handle"
      >
        <div ref={draggableRef} style={{ position: 'fixed', bottom: '1%', left: '580px' }}>
          <Resizable
            defaultSize={{ width: 800, height: 300 }}
            minWidth={400}
            minHeight={100}
            style={{ backgroundColor: '#090909' }}
          >
            <div
              style={{
                backgroundColor: '#090909',
                width: '100%',
                height: '100%',
                zIndex: 3,
              }}
            >
              <div
                className="handle"
                style={{
                  backgroundColor: '#151515',
                  margin: '0px',
                  marginBottom: '2px',
                  height: '17px',
                }}
              >
                <p style={{ margin: '0px', marginLeft: '4px', fontSize: '11px' }}>
                  Messages - Connected as PWM_GND - Session is ACTIVE
                </p>
              </div>
              <div
                style={{
                  lineHeight: '16px',
                  fontSize: '15px',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  paddingBottom: '5px',
                  height: 'calc(100% - 19px)',
                }}
              >
                <List
                  sx={{
                    overflowY: 'scroll',
                    maxHeight: 'calc(100% - 5px)',
                    width: '100%',
                    height: 'calc(100% - 5px)',
                    padding: '0px',
                  }}
                >
                  {createMessageDisplay()}
                  <li ref={scrollRef}></li>
                </List>
              </div>
            </div>
          </Resizable>
        </div>
      </Draggable>
    );
  }, [messages, completeRequest]);
}
