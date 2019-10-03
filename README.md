# @ux/stylr

## useStyles
```ts
(
  stylesheet: {
    [modifier: string]: {
      [namespace: string]: {
        [cssProperty: string]: string | number
      }
    }
  },
  modifiers: object | object[]
) => {
  styles: object
}
```

- async style loading
- memoized so we do as few recalculations as possible
- runtime vendor prefixing (only adds prefixes needed by the current browser)

### Usage
```ts
// default
const { styles } = useStyles({
  default: {
    root: {
      color: '#000'
    }
  }
});
```
```ts
// modifiers
const { styles } = useStyles({
  default: {
    root: {
      color: '#000'
    }
  },
  invert: {
    root: {
      color: '#FFF'
    }
  }
}, {
  invert: true
})
```
```ts
// key-value modifiers
const { styles } = useStyles({
  default: {
    root: {
      color: '#CCC'
    }
  },
  'theme.light': {
    root: {
      color: '#000'
    }
  },
  'theme.dark': {
    root: {
      color: '#FFF'
    }
  }
}, {
  theme: props.theme
})
```
```ts
// async modifiers
const { styles } = useStyles({
  default: {
    root: {
      color: '#CCC'
    }
  },
  'theme.light': () => import('./light'),
  'theme.dark': () => import('./dark')
}, {
  theme: props.theme
});
```

### caveats
- due to memoization techniques, any props used by your stylesheet should be passed in as modifiers, otherwise it will not know to recompute the styles when they change

## withInteraction 
(alias withHover)
```ts
(WrappedComponent) => Component
```

### usage
```tsx
const Interactive = withInteraction((props) => {
  return (
    <span>
      {props.hover ? 'Hovering' : ''}
      {props.focus ? 'Focused' : ''}
      {props.active ? 'Active' : ''}
      {/* when you want the same style for hover and focus */}
      {props.hocus ? 'Hocus' : ''}
    </span>
  );
});
```

### removeInteraction
A hook which omits the props from withInteraction. Use when you want the interaction props for the stylesheet but then to exclude from the actual component; where you use in a component that spreads props you may get `Received "false" for a non-boolean attribute` console warnings if you don't do this.
