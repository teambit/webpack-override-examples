import React from 'react';
import { render } from '@testing-library/react';
import { BasicMyComp } from './my-comp.composition';

describe('my-comp', () => {
  it('should render with the correct text', () => {
    const { getByText } = render(<BasicMyComp />);
    const rendered = getByText('hello from MyComp');
    expect(rendered).toBeTruthy();
  });
});
