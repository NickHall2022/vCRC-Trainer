export function TextToSpeechSection() {
  function isMicrosoftEdge() {
    return navigator.userAgent.includes('Edg/');
  }

  isMicrosoftEdge();

  return (
    <>
      <h3>Text to Speech:</h3>
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
