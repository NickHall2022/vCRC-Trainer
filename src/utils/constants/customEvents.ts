export type SelectAircraftEventDetails = {
  callsign: string;
};

export function fireSelectAircraftEvent(callsign: string) {
  document.dispatchEvent(
    new CustomEvent<SelectAircraftEventDetails>('selectairplane', { detail: { callsign } })
  );
}

export type CompleteRequestEventDetails = {
  callsign: string;
  completedByVoice: boolean;
};

export function fireCompleteRequestEvent(callsign: string, completedByVoice: boolean = false) {
  document.dispatchEvent(
    new CustomEvent<CompleteRequestEventDetails>('completerequest', {
      detail: { callsign, completedByVoice },
    })
  );
}
