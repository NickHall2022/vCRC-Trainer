import { Box } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import MistakeList from './MistakeList';
import { useMistakes } from '../../hooks/useMistakes';
import { Guard } from './Guard';
import { FeedbackLink } from './FeedbackLink';

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function MistakeTracker({ setOpen }: Props) {
  const { setPaused } = useSimulation();
  const { setNewMistakes } = useMistakes();

  function handleResumeClicked() {
    setOpen(false);
    setPaused(false);
    setNewMistakes([]);
  }

  return (
    <Guard>
      <Box className="welcome" sx={{ overflowY: 'scroll', maxHeight: '90vh' }}>
        <h2 style={{ textAlign: 'center' }}>Areas of Improvement</h2>

        <p>
          This is <b>not</b> an exhaustive list. This tool is only designed to help point out some
          things you can improve upon. Be sure to refer to other sources of documentation to clarify
          correct procedures.
        </p>

        <hr></hr>

        <MistakeList></MistakeList>

        <br></br>

        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              backgroundColor: '#444',
              padding: '20px',
              border: '1px solid white',
            }}
            onClick={handleResumeClicked}
          >
            Resume
          </button>
        </div>

        <FeedbackLink></FeedbackLink>
      </Box>
    </Guard>
  );
}

export default MistakeTracker;
