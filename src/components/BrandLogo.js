import React from 'react';
import logoUrl from '../assets/logo.png';

export default function BrandLogo({ className = '', height = 48, width, alt = 'Compassionate Alliance' }) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      className={['brandLogo', className].filter(Boolean).join(' ')}
      height={height}
      width={width}
      style={{ width: width ?? 'auto', height, display: 'block' }}
    />
  );
}
