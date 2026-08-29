"use client";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { buttonIconSize, buttonStyle, type ButtonProps } from "./Button";
import { Icon } from "./Icon";

interface LinkButtonProps extends Pick<ButtonProps, "variant" | "size" | "icon" | "iconAfter" | "fullWidth"> {
  href: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Button styling on a Next link — for navigation that should read as an action. */
export function LinkButton({ href, variant = "primary", size = "md", icon, iconAfter, fullWidth, style, children }: LinkButtonProps) {
  const [h, setH] = useState(false), [p, setP] = useState(false);
  return (
    <Link
      href={href} className="plain"
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={buttonStyle(variant, size, { hover: h, press: p }, { width: fullWidth ? "100%" : undefined, ...style })}
    >
      {icon && <Icon name={icon} size={buttonIconSize(size)} />}{children}{iconAfter && <Icon name={iconAfter} size={buttonIconSize(size)} />}
    </Link>
  );
}
