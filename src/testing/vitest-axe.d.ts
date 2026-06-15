// vitest-axe's matcher augmentation does not target vitest 4's Assertion type,
// so declare the matcher we use here.
import 'vitest';

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
