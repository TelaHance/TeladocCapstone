import React from 'react';
import SpinnerSVG from '@assets/spinner.svg';

export default function Spinner({width='100px', height='100px'}: SpinnerProps) {
  return (
    <div style={{'width': width, 'height': height}}>
      <img src={SpinnerSVG}/>
    </div>
  );
}

type SpinnerProps = {
  width?: string;
  height?: string;
}
