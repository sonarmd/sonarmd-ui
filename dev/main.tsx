import {createRoot} from 'react-dom/client';
import {ThemeProvider} from '../src/index';
import {Workbench} from './Workbench';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Workbench />
  </ThemeProvider>,
);
