import React from 'react';
/**
 * Behavioral coverage: aria-current marks the active step, completed steps are
 * navigable buttons when onStepClick is given, and upcoming steps are not.
 */
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect, vi} from 'vitest';
import {Stepper} from './index';

const steps = [{label: 'Intake'}, {label: 'Review'}, {label: 'Approval'}];

test('the active step carries aria-current="step"', () => {
  render(<Stepper steps={steps} activeStep={1} />);
  const items = screen.getAllByRole('listitem');
  expect(items[1].getAttribute('aria-current')).toBe('step');
  expect(items[0].getAttribute('aria-current')).toBeNull();
});

test('completed and current steps are clickable; upcoming are not', () => {
  const onStepClick = vi.fn();
  render(<Stepper steps={steps} activeStep={1} onStepClick={onStepClick} />);
  // Two navigable buttons: completed (Intake) and current (Review). Upcoming (Approval) is static.
  expect(screen.getAllByRole('button')).toHaveLength(2);

  fireEvent.click(screen.getByRole('button', {name: /Intake/}));
  expect(onStepClick).toHaveBeenCalledWith(0);
});

test('without onStepClick there are no step buttons', () => {
  render(<Stepper steps={steps} activeStep={1} />);
  expect(screen.queryAllByRole('button')).toHaveLength(0);
});
