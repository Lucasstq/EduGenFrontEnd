import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function Card({ children, className = '', onClick, clickable = false }: CardProps) {
  return (
    <div
      className={`${styles.card} ${clickable ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;
