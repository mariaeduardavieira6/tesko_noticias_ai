"use client";

import * as React from "react";

type PopoverContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextType | null>(null);

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);
  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactElement;
}) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) return children;
  const props = {
    onClick: (e: React.MouseEvent) => {
      ctx.setOpen(!ctx.open);
      if (children.props.onClick) children.props.onClick(e);
    },
    "aria-expanded": ctx.open,
  } as const;
  return asChild ? React.cloneElement(children, props) : (
    <button type="button" {...(props as any)}>{children}</button>
  );
}

export function PopoverContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(PopoverContext);
  if (!ctx || !ctx.open) return null;
  return (
    <div
      role="dialog"
      className={
        className ??
        "z-50 mt-2 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md"
      }
    >
      {children}
    </div>
  );
}

