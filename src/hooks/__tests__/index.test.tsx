import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import useStyles from '../useStyles';

const createSink = (cb: Function) => (props: any) => {
  cb(props);
  return null;
};
const after = (delay: number) => new Promise((res) => {
  setTimeout(res, delay);
});

describe("useStyles", function() {
  it('returns a styles object', () => {
    const Foo = createSink(() => {
      const { styles } = useStyles({});

      expect(typeof styles).to.equal('object');
    });

    mount(<Foo/>);
  });
  it('contains styles from the default namespace', () => {
    const Foo = createSink(() => {
      const { styles } = useStyles({
        default: {
          root: {
            color: 'black',
            backgroundColor: 'white',
          },
        },
      });

      expect(styles.root.color).to.equal('black');
      expect(styles.root.backgroundColor).to.equal('white');
    });

    mount(<Foo/>);
  });
  it('merges in props based on a modifier object', () => {
    const Foo = createSink(() => {
      const stylesheet = {
        default: {
          root: {
            color: 'black',
            backgroundColor: 'white',
          },
        },
        apple: {
          root: {
            color: 'green',
          }
        },
      };
      const modifiers = { apple: true };
      const { styles } = useStyles(stylesheet, modifiers);

      expect(styles.root.color).to.equal('green');
      expect(styles.root.backgroundColor).to.equal('white');
    });

    mount(<Foo/>);
  });
  it('allows key/value modifiers', () => {
    const Foo = createSink(() => {
      const stylesheet = {
        default: {
          root: {
            color: 'black',
            backgroundColor: 'white',
          },
        },
        'fruit-apple': {
          root: {
            color: 'green',
          }
        },
      };
      const modifiers = { fruit: 'apple' };
      const { styles } = useStyles(stylesheet, modifiers);

      expect(styles.root.color).to.equal('green');
      expect(styles.root.backgroundColor).to.equal('white');
    });

    mount(<Foo/>);
  });
  it('uses modifier order for overwrite precidence', () => {
    const Foo = createSink(() => {
      const stylesheet = {
        default: {
          root: {
            color: 'black',
            backgroundColor: 'white',
          },
        },
        'fruit-apple': {
          root: {
            color: 'green',
          }
        },
        'fruit-banana': {
          root: {
            color: 'yellow',
          },
        },
        'fruit-orange': {
          root: {
            color: 'orange',
          },
        },
      };
      const modifiers = [
        { fruit: 'orange' },
        { fruit: 'apple' },
        { fruit: 'banana' },
      ];
      const { styles } = useStyles(stylesheet, modifiers);

      expect(styles.root.color).to.equal('yellow');
      expect(styles.root.backgroundColor).to.equal('white');
    });

    mount(<Foo/>);
  });
  context('when stylesheet uses props for values', function() {
    context("when prop is not a modifier", function() {
      it('will not update on subsequent renders', () => {
        let styles: any;
        const Foo = createSink((props) => {
          const stylesheet = {
            default: {
              root: {
                color: props.color,
                backgroundColor: props.background,
              },
            },
          };
          const modifiers = {};
          const { styles: _styles } = useStyles(stylesheet, modifiers);
    
          styles = _styles;
        });
    
        const wrapper = mount(<Foo color="blue" background="grey"/>);

        expect(styles.root.color).to.equal('blue');
        expect(styles.root.backgroundColor).to.equal('grey');

        wrapper.setProps({ color: 'orange' });

        expect(styles.root.color).to.equal('blue');
      });
    });
    context("when prop is a modifier", function() {
      it('will update on subsequent renders', () => {
        let styles: any;
        const Foo = createSink((props) => {
          const stylesheet = {
            default: {
              root: {
                color: props.color,
                backgroundColor: props.background,
              },
            },
          };
          const modifiers = { color: props.color };
          const { styles: _styles } = useStyles(stylesheet, modifiers);
    
          styles = _styles;
        });
    
        const wrapper = mount(<Foo color="blue" background="grey"/>);

        expect(styles.root.color).to.equal('blue');
        expect(styles.root.backgroundColor).to.equal('grey');

        wrapper.setProps({ color: 'orange' });

        expect(styles.root.color).to.equal('orange');
      });
    });
  });
  context("when namespace is a promise", function() {
    it('returns the default styles', () => {
      let styles: any;
      const Foo = createSink((props) => {
        const stylesheet = {
          default: {
            root: {
              color: 'black',
              backgroundColor: 'white',
            },
          },
          foo: () => after(100).then(() => ({
            root: {
              color: 'green',
            },
          })),
        };
        const modifiers = { color: props.color };
        const { styles: _styles } = useStyles(stylesheet, modifiers);
  
        styles = _styles;
      });
  
      mount(<Foo/>);

      expect(styles.root.color).to.equal('black');
    });
    it('includes async styles once loaded', () => {
      let styles: any;
      const Foo = createSink((props) => {
        const stylesheet = {
          default: {
            root: {
              color: 'black',
              backgroundColor: 'white',
            },
          },
          foo: () => after(100).then(() => ({
            root: {
              color: 'green',
            },
          })),
        };
        const modifiers = { foo: true };
        const { styles: _styles } = useStyles(stylesheet, modifiers);
  
        styles = _styles;
      });
  
      mount(<Foo/>);

      return after(150).then(() => {
        expect(styles.root.color).to.equal('green');
      });
    });
    it('abandons promise result if component is unmounted', () => {
      let styles: any;
      const Foo = createSink(() => {
        const stylesheet = {
          default: {
            root: {
              color: 'black',
              backgroundColor: 'white',
            },
          },
          foo: () => after(100).then(() => ({
            root: {
              color: 'green',
            },
          })),
        };
        const modifiers = { foo: true };
        const { styles: _styles } = useStyles(stylesheet, modifiers);
  
        styles = _styles;
      });
  
      const wrapper = mount(<Foo/>);

      return after(50)
        .then(() => {
          wrapper.unmount();
          return after(150);
        })
        .then(() => {
          expect(styles.root.color).to.equal('black');
        });
    });
  });
  context("when namespace is a dynamic import", function() {
    it('returns the default styles', () => {
      let styles: any;
      const Foo = createSink((props) => {
        const stylesheet = {
          default: {
            root: {
              color: 'black',
              backgroundColor: 'white',
            },
          },
          foo: () => import('./dynamic-import'),
        };
        const modifiers = { foo: true };
        const { styles: _styles } = useStyles(stylesheet, modifiers);
  
        styles = _styles;
      });
  
      mount(<Foo/>);

      expect(styles.root.color).to.equal('black');

      // return after(150).then(() => {
      //   expect(styles.root.color).to.equal('green');
      // });
    });
    it('includes async styles once loaded', () => {
      let styles: any;
      const Foo = createSink((props) => {
        const stylesheet = {
          default: {
            root: {
              color: 'black',
              backgroundColor: 'white',
            },
          },
          foo: () => import('./dynamic-import'),
        };
        const modifiers = { foo: true };
        const { styles: _styles } = useStyles(stylesheet, modifiers);
  
        styles = _styles;
      });
  
      mount(<Foo/>);

      return after(150).then(() => {
        expect(styles.root.color).to.equal('green');
      });
    });
  });
});
