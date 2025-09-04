import Grid from '@mui/material/Grid';
import { CabViewWindow } from '../components/CRC/CabViewWindow';
import { StripsWindow } from '../components/vStrips/StripsWindow';
import { useState } from 'react';
import Help from '../components/Menus/Help';
import HelpIcon from '@mui/icons-material/Help';
import ErrorIcon from '@mui/icons-material/Error';
import { useSimulation } from '../hooks/useSimulation';
import MistakeTracker from '../components/Menus/MistakeTracker';
import { useMistakes } from '../hooks/useMistakes';

export function CGgroundPage() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [mistakesOpen, setMistakesOpen] = useState(false);
  const { setPaused } = useSimulation();
  const { newMistakes } = useMistakes();

  function handleHelpClicked() {
    setHelpOpen(true);
    setPaused(true);
  }

  function handleMistakesClicked() {
    setMistakesOpen(true);
    setPaused(true);
  }

  return (
    <>
      <Grid container>
        <Grid size={'auto'} sx={{ overflow: 'none' }}>
          <StripsWindow></StripsWindow>
        </Grid>
        <Grid size={'grow'}>
          <CabViewWindow></CabViewWindow>
        </Grid>
      </Grid>
      {newMistakes.length > 0 && (
        <div
          style={{
            position: 'fixed',
            zIndex: 4,
            right: '315px',
            bottom: '35px',
            color: 'red',
          }}
        >
          <ErrorIcon></ErrorIcon>
        </div>
      )}
      <button
        onClick={handleMistakesClicked}
        style={{
          backgroundColor: '#444',
          padding: '8px',
          border: '1px solid white',
          position: 'fixed',
          zIndex: 3,
          right: '110px',
          bottom: '15px',
        }}
      >
        &nbsp;
        <span style={{ fontSize: '20px' }}>Areas for Improvement</span>
      </button>
      <button
        onClick={handleHelpClicked}
        style={{
          backgroundColor: '#444',
          padding: '8px',
          border: '1px solid white',
          position: 'fixed',
          zIndex: 3,
          right: '15px',
          bottom: '15px',
        }}
      >
        <HelpIcon
          sx={{ fontSize: '20px', position: 'relative', top: '3px' }}
        ></HelpIcon>
        &nbsp;
        <span style={{ fontSize: '20px' }}>Help</span>
      </button>
      {helpOpen && <Help setHelpOpen={setHelpOpen}></Help>}
      {mistakesOpen && (
        <MistakeTracker setOpen={setMistakesOpen}></MistakeTracker>
      )}
    </>
  );
}
