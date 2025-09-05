import { Grid } from '@mui/material';
import { SPEECH_AVAILABLE } from '../../utils/constants/speech';
import { CheckCircleOutline } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export function VoiceRecognitionSection() {
  const [pttButton, setPttButton] = useState(localStorage.getItem('pttButton') || 'Q');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });

  function handleKeyPress(event: KeyboardEvent) {
    if (listening) {
      setListening(false);
      setPttButton(event.key);
      localStorage.setItem('pttButton', event.key);
      event.preventDefault();
    }
  }

  function handleButtonPress() {
    setListening(true);
  }

  // let microphonePermissions = navigator.mediaDevices
  //   .getUserMedia({ audio: true })
  //   .then(function () {
  //     console.log('You let me use your mic!');
  //   })
  //   .catch(function () {
  //     console.log('No mic for you!');
  //   });

  if (!SPEECH_AVAILABLE) {
    return (
      <>
        <h3>Voice Recognition:</h3>
        <div
          style={{
            backgroundColor: '#ff000036',
            height: '50px',
            borderRadius: '5px',
            border: '1px solid red',
            textAlign: 'center',
            lineHeight: '46px',
          }}
        >
          <b>Your browser does not support voice recognition! Try Chrome or Edge.</b>
        </div>
      </>
    );
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid>
          <h3>Voice Recognition:</h3>
        </Grid>
        <Grid
          alignItems="center"
          display={'flex'}
          style={{ color: 'rgba(0, 189, 0, 1)', paddingTop: '20px' }}
        >
          <span style={{ marginRight: '8px' }}>Your browser supports voice recognition</span>
          <CheckCircleOutline style={{ fontSize: '25px' }} />
        </Grid>
      </Grid>
      <p>
        vSweatbox has a built-in voice recognition system to allow you to "talk" to the planes just
        as you would in the real sweatbox or live network. Here's a few quick tips:
      </p>
      <ol>
        <li>Enable microphone permission for this page</li>
        <li>
          Check your browser microphone settings to make sure you have the right device selected
        </li>
        <li>Begin every transmission with the callsign you are trying to talk to</li>
        <li>Set up your push to talk button below:</li>
      </ol>

      <Grid container spacing={3} display="flex" alignItems={'center'}>
        <Grid size={'grow'}></Grid>
        <Grid>
          Push to talk button: <b>{pttButton}</b>
        </Grid>
        <Grid>
          <button onClick={handleButtonPress} style={{ width: '250px' }}>
            {listening ? 'Press any key' : 'Click to set PTT button'}
          </button>
        </Grid>
        <Grid size={'grow'}></Grid>
      </Grid>

      <hr></hr>
    </>
  );
}
