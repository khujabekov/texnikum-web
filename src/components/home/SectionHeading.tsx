type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
};

export default function SectionHeading({
  kicker,
  title,
  description,
  dark = false,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${
          dark
            ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {kicker}
      </span>
      <h2
        className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
