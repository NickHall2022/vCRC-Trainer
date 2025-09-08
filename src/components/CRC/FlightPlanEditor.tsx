import { Grid } from '@mui/material';
import { useAircraft } from '../../hooks/useAircraft';
import type { FlightPlan } from '../../types/common';
import { useState, useEffect, useRef, type RefObject, useMemo, useCallback } from 'react';
import Draggable from 'react-draggable';
import { makeEmptyFlightPlan } from '../../utils/flightPlans';
import { useStrips } from '../../hooks/useStrips';
import { useImmer } from 'use-immer';
import { ControlledInput } from '../Menus/ControlledInput';

export function FlightPlanEditor() {
  const { amendFlightPlan, aircrafts } = useAircraft();
  const { printAmendedFlightPlan } = useStrips();

  const draggableRef = useRef<HTMLDivElement>(null);

  const [flightPlan, setFlightPlan] = useImmer<FlightPlan>(makeEmptyFlightPlan());
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const callsignInputRef = useRef<HTMLInputElement>(null);

  const handleCallsignChange = useCallback(
    (callsign: string) => {
      const aircraft = aircrafts.find((aircraft) => aircraft.callsign === callsign);
      setHasBeenEdited(false);
      if (aircraft) {
        setFlightPlan({ ...aircraft.flightPlan });
      } else {
        setFlightPlan({ ...makeEmptyFlightPlan(), callsign });
      }
    },
    [setHasBeenEdited, setFlightPlan, aircrafts]
  );

  useEffect(() => {
    function handleControlF(event: KeyboardEvent) {
      if (event.key === 'f' && event.ctrlKey) {
        event.preventDefault();
        setFlightPlan(makeEmptyFlightPlan());
        callsignInputRef.current?.focus();
        setHasBeenEdited(false);
      }
    }

    function handleSelectAirplane(event: CustomEventInit) {
      handleCallsignChange(event.detail.callsign);
    }

    document.addEventListener('keydown', handleControlF);
    document.addEventListener('selectairplane', handleSelectAirplane);
    return () => {
      document.removeEventListener('keydown', handleControlF);
      document.removeEventListener('selectairplane', handleSelectAirplane);
    };
  }, [setFlightPlan, handleCallsignChange]);

  function handleAmendFlightPlan() {
    setHasBeenEdited(false);
    const existingFlightPlan = aircrafts.find(
      (aircraft) => aircraft.callsign === flightPlan.callsign
    )?.flightPlan;
    if (!existingFlightPlan) {
      throw new Error('flight plan not properly selected');
    }
    const amendedFlightPlan: FlightPlan = {
      ...existingFlightPlan,
      printCount: flightPlan.printCount + 1,
      created: true,
      aircraftType: flightPlan.aircraftType,
      equipmentCode: flightPlan.equipmentCode,
      departure: flightPlan.departure,
      destination: flightPlan.destination,
      speed: flightPlan.speed,
      altitude: flightPlan.altitude,
      route: flightPlan.route,
      remarks: flightPlan.remarks,
    };
    if (amendedFlightPlan.equipmentCode.length === 0) {
      amendedFlightPlan.equipmentCode = 'A';
    }

    amendFlightPlan(amendedFlightPlan);
    printAmendedFlightPlan(amendedFlightPlan);
    setFlightPlan(amendedFlightPlan);
  }

  function handleEnterPressed(event: React.KeyboardEvent) {
    if (event.key === 'Enter' && hasBeenEdited) {
      event.preventDefault();
      handleAmendFlightPlan();
    }
  }

  const editButtonEnabled =
    (flightPlan.created && hasBeenEdited) || (!flightPlan.created && flightPlan.squawk !== '');

  const { topTextInputs, bottomTextInputs } = useMemo(() => {
    function handleTextInput(fieldType: keyof FlightPlan, value: string) {
      setFlightPlan((draft) => {
        if (draft[fieldType] !== value) {
          setHasBeenEdited(true);
        }
        draft[fieldType] = value as never;
      });
    }

    return {
      topTextInputs: (
        <>
          <Grid size={'auto'}>
            BCN
            <br></br>
            <ControlledInput
              className="flightPlanInput flightPlanReadonly"
              disabled={true}
              maxLength={4}
              value={flightPlan.created ? flightPlan?.squawk : ''}
              style={{ width: '40px' }}
            ></ControlledInput>
          </Grid>
          <Grid size={'auto'}>
            TYP
            <br></br>
            <ControlledInput
              className="flightPlanInput"
              maxLength={4}
              value={flightPlan?.aircraftType}
              onChange={(event) =>
                handleTextInput('aircraftType', event.target.value.toUpperCase())
              }
              style={{ width: '40px' }}
            ></ControlledInput>
          </Grid>
          <Grid size={'auto'}>
            EQ
            <br></br>
            <ControlledInput
              className="flightPlanInput"
              maxLength={1}
              value={flightPlan?.equipmentCode}
              onChange={(event) =>
                handleTextInput('equipmentCode', event.target.value.toUpperCase())
              }
              style={{ width: '20px' }}
            ></ControlledInput>
          </Grid>
          <Grid size={'auto'}>
            DEP
            <br></br>
            <ControlledInput
              className="flightPlanInput"
              maxLength={4}
              value={flightPlan?.departure}
              onChange={(event) => handleTextInput('departure', event.target.value.toUpperCase())}
              style={{ width: '40px' }}
            ></ControlledInput>
          </Grid>
          <Grid size={'auto'}>
            DEST
            <br></br>
            <ControlledInput
              className="flightPlanInput"
              maxLength={4}
              value={flightPlan?.destination}
              onChange={(event) => handleTextInput('destination', event.target.value.toUpperCase())}
              style={{ width: '40px' }}
            ></ControlledInput>
          </Grid>
          <Grid size={'auto'}>
            SPD
            <br></br>
            <ControlledInput
              className="flightPlanInput"
              maxLength={4}
              value={flightPlan?.speed}
              onChange={(event) => handleTextInput('speed', event.target.value.replace(/\D/g, ''))}
              style={{ width: '40px' }}
            ></ControlledInput>
          </Grid>
          <Grid size={'auto'}>
            ALT
            <br></br>
            <ControlledInput
              className="flightPlanInput"
              maxLength={7}
              value={flightPlan?.altitude}
              onChange={(event) => handleTextInput('altitude', event.target.value.toUpperCase())}
              style={{ width: '60px' }}
            ></ControlledInput>
          </Grid>
        </>
      ),
      bottomTextInputs: (
        <>
          <Grid container spacing={0.5}>
            <Grid size={1} style={{ textAlign: 'right', fontSize: '14px' }}>
              RTE
            </Grid>
            <Grid size={'grow'}>
              <ControlledInput
                isTextArea={true}
                className="flightPlanTextArea"
                value={flightPlan?.route}
                onChange={(event) => handleTextInput('route', event.target.value.toUpperCase())}
              ></ControlledInput>
            </Grid>
          </Grid>
          <Grid container spacing={0.5}>
            <Grid size={1} style={{ textAlign: 'right', fontSize: '14px' }}>
              RMK
            </Grid>
            <Grid size={'grow'}>
              <ControlledInput
                isTextArea={true}
                className="flightPlanTextArea"
                value={flightPlan?.remarks}
                onChange={(event) => handleTextInput('remarks', event.target.value)}
              ></ControlledInput>
            </Grid>
          </Grid>
        </>
      ),
    };
  }, [flightPlan, setFlightPlan]);

  return (
    <Draggable
      nodeRef={draggableRef as RefObject<HTMLElement>}
      allowAnyClick={true}
      handle=".handle"
    >
      <div
        className="preventSelect"
        ref={draggableRef}
        style={{
          width: '620px',
          height: '155px',
          backgroundColor: '#090909',
          position: 'absolute',
          top: '1%',
          left: '580px',
          zIndex: 3,
        }}
        onKeyDown={handleEnterPressed}
      >
        <div
          className="handle"
          style={{
            backgroundColor: '#151515',
            margin: '0px',
            marginBottom: '2px',
          }}
        >
          <p style={{ margin: '0px', marginLeft: '4px', fontSize: '11px' }}>Flight Plan Editor</p>
        </div>
        <Grid
          container
          columnSpacing={1}
          style={{ textAlign: 'center', fontSize: '14px', marginBottom: '3px' }}
        >
          <Grid size={1}></Grid>
          <Grid size={'auto'}>
            AID
            <br></br>
            <ControlledInput
              className="flightPlanInput"
              maxLength={7}
              externalRef={callsignInputRef}
              value={flightPlan?.callsign}
              onChange={(event) => handleCallsignChange(event.target.value.toUpperCase())}
              style={{ width: '60px' }}
            ></ControlledInput>
          </Grid>
          {topTextInputs}
          <Grid size={1}>
            <button
              disabled={!editButtonEnabled}
              style={{ marginTop: '6px' }}
              className="amendFlightPlanButton"
              onClick={handleAmendFlightPlan}
            >
              {flightPlan.created ? 'Amend' : 'Create'}
            </button>
          </Grid>
        </Grid>
        {bottomTextInputs}
      </div>
    </Draggable>
  );
}
