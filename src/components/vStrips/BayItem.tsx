import { type Dispatch, type SetStateAction } from 'react';
import type { AbstractStrip, DividerData, StripData } from '../../types/common';
import { DividerStrip } from './DividerStrip';
import { Strip } from './Strip';
import { HandWrittenDividerStrip } from './HandwrittenDividerStrip';

type Props = {
  abstractStripData: AbstractStrip;
  setDraggedStrip: Dispatch<SetStateAction<AbstractStrip>>;
  handleStripInsert: (targetStrip: AbstractStrip) => void;
};

export function BayItem({ abstractStripData, setDraggedStrip, handleStripInsert }: Props) {
  function handleDragStart() {
    setDraggedStrip(abstractStripData);
  }

  function handleDrop() {
    handleStripInsert(abstractStripData);
  }

  function handleDragOver(event: React.DragEvent) {
    if (abstractStripData.bayName !== 'printer') {
      event.preventDefault();
    }
  }

  if (abstractStripData.type === 'strip' || abstractStripData.type === 'blank') {
    return (
      <div onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver}>
        <Strip stripData={abstractStripData as StripData}></Strip>
      </div>
    );
  }
  if (abstractStripData.type === 'divider') {
    return (
      <div onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver}>
        <DividerStrip stripData={abstractStripData as DividerData}></DividerStrip>
      </div>
    );
  }
  if (abstractStripData.type === 'handwrittenDivider') {
    return (
      <div onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver}>
        <HandWrittenDividerStrip
          stripData={abstractStripData as DividerData}
        ></HandWrittenDividerStrip>
      </div>
    );
  }

  throw new Error(`Missing implementation of strip type ${abstractStripData.type}`);
}
