"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type ParsedValue = { prefix: string; suffix: string; num: number };

function parseValue(raw: string): ParsedValue | null {
  const match = raw.match(/^([^0-9]*)([\d.,\s]+)(.*)$/);
  if (!match) return null;
  const num = Number.parseFloat(match[2].replace(/[\s,]/g, ""));
  if (!Number.isFinite(num)) return null;
  return { prefix: match[1], suffix: match[3], num };
}

function render(value: ParsedValue, current: number): string {
  return Number.isInteger(value.num)
    ? String(Math.round(current))
    : current.toFixed(1);
}

type CountUpProps = {
  value: string;
  duration?: number;
};

export default function CountUp({ value, duration = 1.8 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const parsed = useMemo(() => parseValue(value), [value]);
  const [text, setText] = useState(() =>
    parsed ? `${parsed.prefix}${render(parsed, 0)}${parsed.suffix}` : value
  );

  useEffect(() => {
    if (!inView || !parsed) return;
    const controls = animate(0, parsed.num, {
      duration,
      ease: "easeOut",
      onUpdate: (current) =>
        setText(
          `${parsed.prefix}${render(parsed, current)}${parsed.suffix}`
        ),
    });
    return () => controls.stop();
  }, [inView, parsed, duration]);

  return <span ref={ref}>{text}</span>;
}
