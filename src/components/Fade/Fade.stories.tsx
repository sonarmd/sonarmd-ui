import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Fade} from './index';
import {Button} from '../Button';
import {Card} from '../Card';

export const Default: Story = () => (
  <Fade>
    <Card title="Faded in on mount">
      <p>This content fades in when the component mounts.</p>
    </Card>
  </Fade>
);

export const WithDelay: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
    <Fade delay={0}><Card title="Immediate" /></Fade>
    <Fade delay={150}><Card title="150ms delay" /></Fade>
    <Fade delay={300}><Card title="300ms delay" /></Fade>
  </div>
);

export const Conditional: Story = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Button onClick={() => setShow((v) => !v)}>{show ? 'Hide' : 'Show'}</Button>
      {show && (
        <Fade style={{marginTop: 12}}>
          <Card title="Appeared!">Content fades in on mount.</Card>
        </Fade>
      )}
    </div>
  );
};
