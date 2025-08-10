import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/Tooltip.scss';

export const Tooltip = ({ text, className = '' }) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [text]);

  const handleMouseEnter = () => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      const tooltipWidth = Math.min(400, window.innerWidth - 30);
      let left = rect.left + window.scrollX;

      if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 10;
      }

      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left,
      });
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <>
      <span
        className={`tooltip ${className}`}
        ref={textRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </span>

      {isTruncated &&
        visible &&
        createPortal(
          <div
            className="tooltip__text tooltip__portal"
            style={{
              top: coords.top,
              left: coords.left,
              maxWidth: Math.min(400, window.innerWidth - 50),
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
};
