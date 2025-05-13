import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

interface AccountSummaryPopOverProps {
  id: string;
  text: number;
  onHoverText: Record<string, number>;
}

export default function AccountSummaryPopOver({ id, text, onHoverText }: AccountSummaryPopOverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div id={id}>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        ₹ {text}
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>
          {Object.entries(onHoverText)
            .filter(([key]) => key.toLowerCase() !== 'total') // Exclude "total" for now
            .map(([key, value]) => (
              <div key={key}>
                {key} : ₹ {value}
              </div>
            ))}
          {/* Add total at the end */}
          {onHoverText['total'] && (
            <div key="total">
              Total : ₹ {onHoverText['total']}
            </div>
          )}
        </Typography>
      </Popover>
    </div>
  );
}