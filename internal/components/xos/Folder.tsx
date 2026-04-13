"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import "./Folder.css";

function darkenColor(hex: string, percent: number): string {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

export type FolderProps = {
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
};

export default function Folder({
  color = "#5227FF",
  size = 1,
  items = [],
  className = "",
}: FolderProps) {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);

  const folderBackColor = darkenColor(color, 0.08);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const folderStyle = {
    "--folder-color": color,
    "--folder-back-color": folderBackColor,
  } as CSSProperties;

  const folderClassName = `folder ${open ? "open" : ""}`.trim();
  const scaleStyle: CSSProperties = { transform: `scale(${size})` };

  return (
    <div
      className={`folder-root ${open ? "folder-root--open" : ""} ${className}`.trim()}
    >
      {open && (
        <div className="folder-cards-stack" onClick={(e) => e.stopPropagation()}>
          {papers.map(
            (item, i) =>
              item != null && (
                <div
                  key={i}
                  className={`folder-card-horizontal folder-card-horizontal--${i + 1}`}
                >
                  <div className="folder-card-horizontal-inner">{item}</div>
                </div>
              )
          )}
        </div>
      )}

      <div className="folder-scale-wrap" style={scaleStyle}>
        <div
          className={folderClassName}
          style={folderStyle}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-label={open ? "Close folder" : "Open folder"}
        >
          <div className="folder__back">
            <div className="folder__brand-watermark" aria-hidden>
              <img src="/xos/project-x-mark.png" alt="" />
            </div>
            {!open && (
              <>
                <div className="paper-peek paper-peek-1" aria-hidden />
                <div className="paper-peek paper-peek-2" aria-hidden />
                <div className="paper-peek paper-peek-3" aria-hidden />
              </>
            )}
            <div className="folder__front" />
            <div className="folder__front right" />
          </div>
        </div>
      </div>
    </div>
  );
}
