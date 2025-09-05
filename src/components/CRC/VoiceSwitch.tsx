import { Grid } from '@mui/material';
import { useRef, type RefObject } from 'react';
import Draggable from 'react-draggable';
import { useSpeech } from '../../hooks/useSpeech';
import { useImmer } from 'use-immer';
import { useSimulation } from '../../hooks/useSimulation';

type ButtonStates = {
  TX: boolean;
  RX: boolean;
  SPKR: boolean;
  XC: boolean;
  XCA: boolean;
};

export function VoiceSwitch() {
  const draggableRef = useRef<HTMLDivElement>(null);

  const { setVoiceSwitchEnabled } = useSpeech();
  const { pushToTalkActive } = useSimulation();

  const [buttonStates, setButtonStates] = useImmer({
    TX: true,
    RX: true,
    SPKR: false,
    XC: false,
    XCA: false,
  });

  function handleButtonClick(buttonType: keyof ButtonStates) {
    if (buttonType === 'RX') {
      return;
    }

    if (buttonType === 'TX') {
      setVoiceSwitchEnabled(!buttonStates['TX']);
    }

    setButtonStates((draft) => {
      draft[buttonType] = !draft[buttonType];
      if (buttonType === 'XCA' && draft[buttonType]) {
        draft['XC'] = true;
      }
      if (buttonType === 'XC' && !draft[buttonType]) {
        draft['XCA'] = false;
      }
    });
  }

  function makeButton(buttonType: keyof ButtonStates) {
    return (
      <button
        className={`voiceSwitchButton${buttonStates[buttonType] ? ' active' : ''}`}
        onClick={() => handleButtonClick(buttonType)}
        style={
          buttonType === 'TX' && pushToTalkActive && buttonStates[buttonType]
            ? { backgroundColor: '#FF8C00' }
            : {}
        }
      >
        {buttonType}
      </button>
    );
  }

  return (
    <Draggable
      nodeRef={draggableRef as RefObject<HTMLElement>}
      allowAnyClick={true}
      handle=".handle"
    >
      <div
        ref={draggableRef}
        style={{
          width: '250px',
          height: '80px',
          backgroundColor: '#090909',
          position: 'absolute',
          bottom: '10%',
          right: '1%',
          zIndex: 3,
          fontSize: '13px',
        }}
      >
        <div
          className="handle"
          style={{
            backgroundColor: '#151515',
            margin: '0px',
            marginBottom: '2px',
          }}
        >
          <p style={{ margin: '0px', marginLeft: '4px', fontSize: '11px' }}>Voice Switch</p>
        </div>
        <div
          style={{
            margin: '5px',
            border: '1px solid #585B6F',
            borderRadius: '5px',
            backgroundColor: '#292A33',
            height: '50px',
            paddingLeft: '5px',
            paddingRight: '5px',
          }}
        >
          <Grid container spacing={2} style={{ marginBottom: '5px' }}>
            <Grid style={{ color: '#00FFFF' }}>121.900</Grid>
            <Grid>PWM - Ground Control</Grid>
          </Grid>
          <Grid container spacing={'4px'}>
            <Grid>{makeButton('TX')}</Grid>
            <Grid>{makeButton('RX')}</Grid>
            <Grid>{makeButton('SPKR')}</Grid>
            <Grid>{makeButton('XC')}</Grid>
            <Grid>{makeButton('XCA')}</Grid>
          </Grid>
        </div>
      </div>
    </Draggable>
  );
}
