import type { AnchorHTMLAttributes } from 'react';
import { onAppLinkClick } from '../lib/router';

export function Link({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onAppLinkClick(event);
      }}
    />
  );
}
