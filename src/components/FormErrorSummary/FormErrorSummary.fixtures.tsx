import React from "react";
import {FormErrorSummary} from './index';
import {useForm} from '../../hooks/useForm';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

// FormErrorSummary needs a live useForm controller, so wrap it. With no errors
// it renders null; the populated-error behavior is covered by useForm.test.tsx.
function FormErrorSummaryFixture(): React.JSX.Element {
  const form = useForm<Record<string, unknown>>();
  return <FormErrorSummary form={form} />;
}

export default defineComponentFixtures(FormErrorSummaryFixture, {
  fixtures: {
    empty: {},
  },
});
