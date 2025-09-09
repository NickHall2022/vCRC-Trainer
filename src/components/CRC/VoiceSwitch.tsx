import { Grid } from '@mui/material';
import { useRef, type Dispatch, type RefObject, type SetStateAction } from 'react';
import Draggable from 'react-draggable';
import { useSpeech } from '../../hooks/useSpeech';
import { useImmer } from 'use-immer';
import { useSimulation } from '../../hooks/useSimulation';
import { useMessages } from '../../hooks/useMessages';
import useSound from 'use-sound';

type ButtonStates = {
  TX: boolean;
  RX: boolean;
  SPKR: boolean;
  XC: boolean;
  XCA: boolean;
};

export function VoiceSwitch() {
  const draggableRef = useRef<HTMLDivElement>(null);

  const {
    setVoiceSwitchEnabled,
  }: {
    setVoiceSwitchEnabled: Dispatch<SetStateAction<boolean>> | undefined;
  } = useSpeech();
  const { pushToTalkActive } = useSimulation();
  const { sendMessage, recieveSwitchEnabled, setRecieveSwitchEnabled } = useMessages();
  const [playErrorSound] = useSound('Error.wav');

  const [buttonStates, setButtonStates] = useImmer({
    TX: !!setVoiceSwitchEnabled,
    RX: recieveSwitchEnabled,
    SPKR: false,
    XC: false,
    XCA: false,
  });

  function handleButtonClick(buttonType: keyof ButtonStates) {
    if (buttonType === 'RX') {
      localStorage.setItem('rxSwitch', `${!buttonStates['RX']}`);
      setRecieveSwitchEnabled(!buttonStates['RX']);
      window.speechSynthesis.cancel();
    }

    if (buttonType === 'TX') {
      if (setVoiceSwitchEnabled) {
        setVoiceSwitchEnabled(!buttonStates['TX']);
      } else {
        playErrorSound();
        sendMessage(
          'Voice recognition is not available in your browser. Microsoft Edge is recommended.',
          '',
          'system'
        );
        return;
      }
    }

    setButtonStates((draft) => {
      draft[buttonType] = !draft[buttonType];
      if (buttonType === 'XCA' && draft[buttonType]) {
        draft['XC'] = true;
      }
      if (buttonType === 'XC' && !draft[buttonType]) {
        draft['XCA'] = false;
      }
      if (buttonType === 'RX' && !draft[buttonType]) {
        draft['SPKR'] = false;
      }
      if (buttonType === 'SPKR' && draft[buttonType]) {
        draft['RX'] = true;
      }
    });
  }

  function makeButton(buttonType: keyof ButtonStates) {
    return (
      <button
        className={`voiceSwitchButton${buttonStates[buttonType] ? ' active' : ''}`}
        onClick={() => handleButtonClick(buttonType)}
        style={
          (buttonType === 'TX' && pushToTalkActive && buttonStates[buttonType]) ||
          (buttonType === 'RX' && window.speechSynthesis.speaking && buttonStates[buttonType])
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
