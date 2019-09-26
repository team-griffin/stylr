import React, { useState } from 'react';

const withHover = (Component: React.ComponentType<any>) => (ownerProps: any) => {
  const [ hover, setHover ] = useState(false);
  const [ focus, setFocus ] = useState(false);
  const [ active, setActive ] = useState(false);

  const handleMouseOver = () => setHover(true);
  const handleMouseLeave = () => setHover(false);
  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);
  const handleMouseDown = () => setActive(true);
  const handleMouseUp = () => setActive(false);

  const hocus = focus || hover;

  const props = {
    ...ownerProps,
    hover,
    focus,
    active,
    hocus,
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      // eslint-disable-next-line react/jsx-no-bind
      onMouseOver={handleMouseOver}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseLeave={handleMouseLeave}
      // eslint-disable-next-line react/jsx-no-bind
      onFocus={handleFocus}
      // eslint-disable-next-line react/jsx-no-bind
      onBlur={handleBlur}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseDown={handleMouseDown}
      // eslint-disable-next-line react/jsx-no-bind
      onMouseUp={handleMouseUp}
    >
      <Component {...props}/>
    </span>
  );
};

export default withHover;
