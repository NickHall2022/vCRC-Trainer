import { useEffect, useRef, useState } from 'react';
import { useStrips } from '../../hooks/useStrips';
import type { DividerData } from '../../types/common';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';

type Props = {
  stripData: DividerData;
};

type Coordinates = {
  mouseX: number;
  mouseY: number;
} | null;

export function HandWrittenDividerStrip({ stripData }: Props) {
  const { setStrips, deleteStrip } = useStrips();
  const [contextMenu, setContextMenu] = useState<Coordinates>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  }

  const handleClose = () => {
    setContextMenu(null);
  };

  function handleDelete() {
    handleClose();
    deleteStrip(stripData.id);
  }

  const style: React.CSSProperties = {
    backgroundImage: `url(blankDivider.png)`,
    width: '550px',
    height: '76px',
    position: 'static',
  };

  function handleInputChanged(value: string) {
    setStrips((draft) => {
      const stripToEdit = draft.find((strip) => strip.id === stripData.id) as DividerData;
      if (stripToEdit) {
        stripToEdit.name = value;
      }
    });
  }

  return (
    <div style={style} draggable={true} onContextMenu={handleContextMenu}>
      <input
        type="text"
        ref={inputRef}
        value={stripData.name}
        onChange={(event) => handleInputChanged(event.target.value)}
        size={stripData.name.length || 3}
        style={{
          fontSize: '40px',
          fontFamily: 'cursive',
          fontWeight: '100',
          textAlign: 'center',
          color: 'black',
          margin: 'auto',
          display: 'block',
          lineHeight: '75px',
          background: 'none',
          border: 'none',
          outline: 'none',
        }}
      ></input>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
        transitionDuration={0}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
