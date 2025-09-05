import { CheckCircleOutline } from '@mui/icons-material';
import { Grid } from '@mui/material';

export function TextToSpeechSection() {
  function isMicrosoftEdge() {
    return navigator.userAgent.includes('Edg/');
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid>
          <h3>Text to Speech:</h3>
        </Grid>
        <Grid
          alignItems="center"
          display="flex"
          style={{ color: 'rgba(0, 189, 0, 1)', paddingTop: '20px' }}
        >
          {isMicrosoftEdge() && (
            <>
              <span style={{ marginRight: '8px' }}>
                You're using the best browser for text-to-speech
              </span>
              <CheckCircleOutline style={{ fontSize: '25px' }} />
            </>
          )}
        </Grid>
      </Grid>
      <p>
        By default, vSweatbox will run aircraft messages through text-to-speech and play them out
        loud for you. You can disable it at any point with the RX button on the voice switch and
        continue in text mode. You can continue to use voice recognition without using
        text-to-speech.
      </p>
      {isMicrosoftEdge() ? (
        <></>
      ) : (
        <div
          style={{
            backgroundColor: '#ff000036',
            height: '50px',
            borderRadius: '5px',
            border: '1px solid red',
            textAlign: 'center',
            lineHeight: '46px',
            marginTop: '10px',
          }}
        >
          <b>
            Your browser has very limited text-to-speech! Using Microsoft Edge is <b>STRONGLY</b>{' '}
            recommended.
          </b>
        </div>
      )}
    </>
  );
}
