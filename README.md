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

## withHover
```ts
(WrappedComponent) => Component
```

### usage
```tsx
const Interactive = withHover((props) => {
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
