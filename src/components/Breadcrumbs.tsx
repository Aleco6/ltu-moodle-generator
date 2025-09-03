'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname() || '/';
  const segments = pathname.split('/').filter(Boolean);


  const crumbs = pathname === '/' 
    ? [{ href: '/', label: 'Home' }]
    : segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/');
        const label = decodeURIComponent(seg).replace(/-/g, ' ');
        return { href, label: label.charAt(0).toUpperCase() + label.slice(1) };
      });

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.href} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
            {i === crumbs.length - 1 ? (
              <span>{c.label}</span>
            ) : (
              <Link href={c.href}>{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}