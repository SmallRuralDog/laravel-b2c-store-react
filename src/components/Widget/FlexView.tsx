import React, { CSSProperties } from 'react';


interface IProps {
  className?: string;
  align?: 'center' | 'baseline' | 'flex-end' | 'flex-start';
  justify?: 'center' | 'space-between' | 'flex-end' | 'flex-start';
  direction?: 'row' | 'column';
  style?: CSSProperties;
  children?
}

/**
 * flex布局
 * @param props
 * @constructor
 */
function FlexView(props: IProps) {
  const { className, align, justify, direction, style } = props;
  return <div className={`flex-view ${className || ''}`}
    style={{
      alignItems: align || 'stretch',
      justifyContent: justify || 'flex-start',
      flexDirection: direction || 'row',
      ...style,
    }}>{props.children}</div>;

}

export default FlexView;
