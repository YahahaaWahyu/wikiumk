export const inputClass =
  "h-10 w-full rounded-md border border-line bg-paper px-3 text-[13px] placeholder:text-muted";

export default function Field({
  htmlFor,
  label,
  counter,
  children,
}: {
  htmlFor: string;
  label: string;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="text-[13px]">
          {label}
        </label>
        {counter}
      </div>
      <div className="mt-[6px]">{children}</div>
    </div>
  );
}
