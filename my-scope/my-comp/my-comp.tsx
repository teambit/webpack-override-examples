import React from 'react';
import {
  style,
  classes
} from './my-comp.st.css';

export type MyCompProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string,
  className: string
};

export function MyComp({ text, className }: MyCompProps) {
  return (
    <button className={style(classes.root, className) } >
        <span className={classes.icon} />
        <span className={classes.label} >{text}</span>
    </button>
  );
}
