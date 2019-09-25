import React, { useState } from 'react';

const withHover = (Component: React.ComponentType<any>) => (ownerProps: any) => {
  const [ hover, setHover ] = useState(false);
  const [ focus, setFocus ] = useState(false);
  const [ active, setActive ] = useState(false);

  const handleMouseOver = () => setHover(true);
  const handleMouseLeave = () => setHover(false);
  const handleFocus = () => {
    setFocus(true);
    setActive(true);
  };
  const handleBlur = () => {
    setFocus(false);
    setActive(false);
  };

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
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Component {...props}/>
    </span>
  );
};

export default withHover;
