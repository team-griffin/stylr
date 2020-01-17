import React, { createElement, useState } from 'react';

interface InteractionProps {
  hover: boolean,
  focus: boolean,
  active: boolean,
  hocus: boolean,
}

const withInteraction = <P>(
  Component: React.ComponentType<P & Partial<InteractionProps>>,
): React.ComponentType<P> => (ownerProps: P) => {
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

    return createElement(
      'span',
      {
        onMouseOver: handleMouseOver,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
      },
      createElement(
        Component,
        props,
      ),
    );
  };

export default withInteraction;
