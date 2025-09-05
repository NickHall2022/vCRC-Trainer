import { Grid } from '@mui/material';
import { useMistakes } from '../../hooks/useMistakes';
import { v4 as uuidv4 } from 'uuid';
import type { Mistake } from '../../types/common';

function createMistakeList(
  newMistakesCount: number,
  mistakes: Mistake[],
  title: string,
  subtitle: string,
  documentation: string,
  mistakeMessage: string,
  width?: string,
  secondaryMessage?: string,
  noteMessage?: string
) {
  if (mistakes.length === 0) {
    return <></>;
  }

  const detailsList = mistakes.map((mistake) => (
    <span key={uuidv4()}>
      {secondaryMessage !== undefined && (
        <>
          {secondaryMessage} <b>{mistake.secondaryDetails}: </b>
        </>
      )}
      <span
        className="flightPlanInput"
        style={{
          width: width ? width : 'auto',
          display: 'inline-block',
          paddingLeft: '5px',
          paddingRight: '5px',
        }}
      >
        {mistake.details?.length === 0 ? <>&nbsp;</> : mistake.details}
      </span>
      &nbsp;
    </span>
  ));

  return (
    <div>
      <Grid container spacing={1}>
        <Grid>
          <p style={{ margin: '0px' }}>
            <b>{title}</b>
          </p>
        </Grid>
        <Grid>
          {newMistakesCount > 0 && <span className="mistakeCounter">{newMistakesCount}</span>}
        </Grid>
      </Grid>

      <p style={{ margin: '0px' }}>
        {subtitle}. {noteMessage && <i>{noteMessage}. </i>}See <b>{documentation}</b>
      </p>
      <p style={{ margin: '0px' }}>
        {mistakeMessage}: {detailsList}
      </p>
      <br></br>
    </div>
  );
}

function MistakeList() {
  const { mistakes, newMistakes } = useMistakes();

  if (mistakes.length === 0) {
    return <p style={{ textAlign: 'center' }}>No mistakes detected yet. Good work!</p>;
  }

  const IFRAltFormat = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'IFRAltFormat').length,
    mistakes.filter((mistake) => mistake.type === 'IFRAltFormat'),
    'IFR Altitude Format',
    'IFR altitudes should be formatted with only 3 digits, such as 220 to indicate Flight Level 220, and should be in multiples of 1000 feet',
    'General SOP 5.15.8',
    'You sent clearances with these incorrect altitudes',
    '60px'
  );

  const badIFRAlt = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'badIFRAlt').length,
    mistakes.filter((mistake) => mistake.type === 'badIFRAlt'),
    'Incorrect IFR Altitude',
    "IFR cruise altitudes are assigned based on an aircraft's direction of flight. Some routes may also have additional restrictions",
    'ATC Handbook 3.7',
    'You sent clearances with these incorrect altitudes',
    '60px',
    'To'
  );

  const badEquipment = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'badEquipment').length,
    mistakes.filter((mistake) => mistake.type === 'badEquipment'),
    'Incorrect Equipment Suffix',
    'Ensure that the equipment suffix makes sense for the filed aircraft type and route',
    'General SOP 5.13.4',
    'You sent clearances with these incorrect equipment suffixes',
    '20px',
    'Type'
  );

  const badRoute = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'badRoute').length,
    mistakes.filter((mistake) => mistake.type === 'badRoute'),
    'Incorrect IFR Route',
    'Whenever possible, assign aircraft to preferred routes found in the IDS',
    'General SOP 7.6',
    'You sent clearances with these incorrect routes',
    undefined,
    'To',
    'Note: there may exist valid routes that vSweatbox is missing, use your best judgement'
  );

  const readbackIFR = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'readbackIFR').length,
    mistakes.filter((mistake) => mistake.type === 'readbackIFR'),
    'IFR Clearance Readback',
    `After an aircraft reads back an IFR clearance, don't forget to tell them "Readback correct"`,
    'ATC Handbook 3.8.2',
    'You forgot to acknowledge the readback for these aircraft'
  );

  const taxiVFR = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'taxiVFR').length,
    mistakes.filter((mistake) => mistake.type === 'taxiVFR'),
    'VFR Departure Readback',
    'VFR departures should expect taxi instructions immediately after their readback',
    'ATC Handbook 3.12.3',
    'You forgot to acknowledge the readback and taxi these aircraft'
  );

  const aircraftHandoff = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'aircraftHandoff').length,
    mistakes.filter((mistake) => mistake.type === 'aircraftHandoff'),
    'Handoff to Tower',
    'Aircraft should be handed off to Tower prior to reaching their departure runway',
    'ATC Handbook 4.3',
    'You forgot to hand off these aircraft'
  );

  const stripHandoff = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'stripHandoff').length,
    mistakes.filter((mistake) => mistake.type === 'stripHandoff'),
    'vStrips Coordination',
    'Ground Control must push a flight strip to Local Control for each departing aircraft',
    'General SOP 5.16.7',
    'You forgot to push a strip to the LC bay for these aircraft'
  );

  const stripBox = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'stripBox').length,
    mistakes.filter((mistake) => mistake.type === 'stripBox'),
    'vStrips Annotation',
    'Strip annotations, especially box 10 and 12, should be filled out for every aircraft',
    'General SOP 5.16',
    'You did not correctly annotate strips for these aircraft'
  );

  const badVFRAircraft = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'badVFRAircraft').length,
    mistakes.filter((mistake) => mistake.type === 'badVFRAircraft'),
    'VFR Aircraft Type',
    'VFR flight plans should include the correct aircraft type',
    'General SOP 5.15.7.1',
    'You had incorrect types for the following aircraft',
    '40px',
    ''
  );

  const VFRAltFormat = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'VFRAltFormat').length,
    mistakes.filter((mistake) => mistake.type === 'VFRAltFormat'),
    'VFR Altitude Format',
    'VFR altitudes should be formatted as VFR/XXX. For example, VFR/045 would indicate VFR at 4500',
    'General SOP 5.15.7.3',
    'You had the following incorrectly formatted altitudes',
    '60px'
  );

  const badVFRAlt = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'badVFRAlt').length,
    mistakes.filter((mistake) => mistake.type === 'badVFRAlt'),
    'Incorrect VFR Altitude',
    'VFR altitudes should match the altitude requested by the pilot',
    'General SOP 5.15.7.3',
    'You had incorrect altitudes for the following aircraft',
    undefined,
    ''
  );

  const badVFRFF = createMistakeList(
    newMistakes.filter((mistakeType) => mistakeType === 'badVFRFF').length,
    mistakes.filter((mistake) => mistake.type === 'badVFRFF'),
    'VFR Flight Following Remarks',
    `Flight plans for a VFR aircraft requesting Flight Following should include "FF" in the remarks section`,
    'General SOP 5.15.7.4',
    'Your remarks were incorrect for the following aircraft',
    undefined,
    ''
  );

  return (
    <>
      {IFRAltFormat}
      {badIFRAlt}
      {badEquipment}
      {badRoute}
      {readbackIFR}
      {taxiVFR}
      {aircraftHandoff}
      {stripHandoff}
      {stripBox}
      {badVFRAircraft}
      {VFRAltFormat}
      {badVFRAlt}
      {badVFRFF}
    </>
  );
}

export default MistakeList;
