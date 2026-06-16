import React from "react";
/**
 * Behavioral tests for useForm. These guard the register() binding contract:
 * a registered field is uncontrolled, so typing persists without the host
 * re-rendering, and the change reaches the store. Snapshot tests cannot catch
 * this; only driving real input events can.
 */
import {useState} from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect, vi} from 'vitest';
import {useForm, type UseFormReturn} from './useForm';
import {FormErrorSummary} from '../components/FormErrorSummary';

/** Subscribes to one field. Lives in a separate component so the input host
 *  does NOT subscribe -- which is exactly the freeze scenario register must
 *  survive. */
function Probe({form}: {form: UseFormReturn<{email: string}>}): React.JSX.Element {
  const {value} = form.useField('email');
  return <output data-testid="probe">{String(value ?? '')}</output>;
}

function TypeHarness(): React.JSX.Element {
  const form = useForm<{email: string}>();
  const [, setTick] = useState(0);
  return (
    <>
      <input aria-label="email" {...form.register('email', {required: 'Email is required.'})} />
      <Probe form={form} />
      <button type="button" onClick={() => setTick((t) => t + 1)}>
        rerender
      </button>
    </>
  );
}

function SubmitHarness({onValid}: {onValid: (v: Record<string, unknown>) => void}): React.JSX.Element {
  const form = useForm<Record<string, unknown>>();
  return (
    <form onSubmit={form.handleSubmit(onValid)}>
      <input aria-label="email" {...form.register('email', {required: 'Email is required.'})} />
      <FormErrorSummary form={form} />
      <button type="submit">submit</button>
    </form>
  );
}

test('register binding is uncontrolled: typing persists and reaches the store', () => {
  render(<TypeHarness />);
  const input = screen.getByLabelText('email') as HTMLInputElement;

  fireEvent.change(input, {target: {value: 'hi@example.com'}});

  // The bug: a controlled value snapshot with no host re-render reverts this.
  expect(input.value).toBe('hi@example.com');
  // The store captured it (read via a subscribing consumer).
  expect(screen.getByTestId('probe').textContent).toBe('hi@example.com');

  // A later host re-render must not wipe the field.
  fireEvent.click(screen.getByText('rerender'));
  expect(input.value).toBe('hi@example.com');
});

test('required validation blocks submit, then passes once the field is filled', () => {
  const onValid = vi.fn();
  render(<SubmitHarness onValid={onValid} />);

  fireEvent.click(screen.getByText('submit'));
  expect(onValid).not.toHaveBeenCalled();
  expect(screen.getByRole('alert').textContent).toContain('Email is required.');

  fireEvent.change(screen.getByLabelText('email'), {target: {value: 'a@b.co'}});
  fireEvent.click(screen.getByText('submit'));
  expect(onValid).toHaveBeenCalledWith({email: 'a@b.co'});
});
