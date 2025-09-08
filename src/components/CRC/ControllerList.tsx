import { Grid } from '@mui/material';
import { useMemo, useRef, type RefObject } from 'react';
import Draggable from 'react-draggable';

export function ControllerList() {
  const draggableRef = useRef<HTMLDivElement>(null);

  return useMemo(
    () => (
      <Draggable
        nodeRef={draggableRef as RefObject<HTMLElement>}
        allowAnyClick={true}
        handle=".handle"
      >
        <div
          ref={draggableRef}
          style={{
            width: '235px',
            height: '180px',
            backgroundColor: '#090909',
            position: 'absolute',
            top: '1%',
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
            <p style={{ margin: '0px', marginLeft: '4px', fontSize: '11px' }}>Controllers</p>
          </div>
          <p className="controllersHeader">ZBW - Boston ARTCC</p>
          <Grid container spacing={1}>
            <Grid size={3}>
              <span className="controllersListItem" style={{ marginLeft: '10px' }}>
                C37
              </span>
            </Grid>
            <Grid size={6}>
              <span className="controllersListItem">Concord 37</span>
            </Grid>
            <Grid size={3}>
              <span className="controllersListItem">134.700</span>
            </Grid>
          </Grid>
          <p className="controllersHeader">PWM - Portland ATCT/TRACON</p>
          <Grid container spacing={1}>
            <Grid size={3}>
              <span className="controllersListItem" style={{ marginLeft: '10px' }}>
                1S
              </span>
            </Grid>
            <Grid size={6}>
              <span className="controllersListItem">CASCO</span>
            </Grid>
            <Grid size={3}>
              <span className="controllersListItem">119.750</span>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={3}>
              <span className="controllersListItemActive" style={{ marginLeft: '10px' }}>
                G1
              </span>
            </Grid>
            <Grid size={6}>
              <span className="controllersListItemActive">Ground Control</span>
            </Grid>
            <Grid size={3}>
              <span className="controllersListItemActive">121.900</span>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={3}>
              <span className="controllersListItem" style={{ marginLeft: '10px' }}>
                1T
              </span>
            </Grid>
            <Grid size={6}>
              <span className="controllersListItem">Local Control</span>
            </Grid>
            <Grid size={3}>
              <span className="controllersListItem">120.900</span>
            </Grid>
          </Grid>
          <p className="controllersHeader">ATIS</p>
          <Grid container spacing={1}>
            <Grid size={6}>
              <span className="controllersListItem" style={{ marginLeft: '10px' }}>
                PWM ATIS
              </span>
            </Grid>
            <Grid size={3}></Grid>
            <Grid size={3}>
              <span className="controllersListItem">119.050</span>
            </Grid>
          </Grid>
        </div>
      </Draggable>
    ),
    []
  );
}
