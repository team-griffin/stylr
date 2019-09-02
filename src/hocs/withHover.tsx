import React, { useState } from 'react';

const withHover = (Component: React.ComponentType<any>) => (ownerProps: any) => {
  const [ hovering, setHovering ] = useState(false);
  const [ focused, setFocused ] = useState(false);
  const [ active, setActive ] = useState(false);

  const handleMouseOver = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);
  const handleFocus = () => {
    setFocused(true);
    setActive(true);
  };
  const handleBlur = () => {
    setFocused(false);
    setActive(false);
  };

  const props = {
    ...ownerProps,
    hovering,
    focused,
    active,
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
