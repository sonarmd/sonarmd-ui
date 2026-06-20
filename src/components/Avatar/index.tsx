import React, {forwardRef, useMemo, useState} from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps {
  /** Image URL. Falls back to initials (then a neutral glyph) if it fails to load. */
  src?: string;
  /** Person/entity name: used as the image alt text and to derive initials. */
  name?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  /** Presence indicator dot; announced via an accessible label. */
  status?: AvatarStatus;
  className?: string;
}

const STATUS_LABEL: Record<AvatarStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * A user/entity avatar. Renders an image when `src` loads, the person's
 * initials (derived from `name`) when it does not, and a neutral glyph when
 * there is neither. An optional presence `status` dot is announced to
 * assistive technology.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {src, name, size = 'md', shape = 'circle', status, className},
  ref,
) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => (name ? initialsOf(name) : ''), [name]);
  const showImage = src != null && !failed;

  const classes = [styles.avatar, styles[size], styles[shape], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes}>
      {showImage ? (
        <img className={styles.image} src={src} alt={name ?? ''} onError={() => setFailed(true)} />
      ) : initials ? (
        <span className={styles.initials} aria-hidden={name ? undefined : true}>
          {initials}
        </span>
      ) : (
        <svg className={styles.glyph} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="currentColor" />
        </svg>
      )}
      {status && (
        <span className={`${styles.status} ${styles[status]}`} role="img" aria-label={STATUS_LABEL[status]} />
      )}
    </span>
  );
});
