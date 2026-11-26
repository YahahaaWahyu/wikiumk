export function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="h-[14px] w-20 rounded-[10px] bg-fill" />
      <div className="mt-3 h-[18px] w-full rounded-md bg-fill" />
      <div className="mt-1 h-[18px] w-4/5 rounded-md bg-fill" />
      <div className="mt-[30px] h-[13px] w-full rounded bg-chrome" />
      <div className="mt-1 h-[13px] w-3/5 rounded bg-chrome" />
      <div className="mt-[27px] flex justify-between">
        <div className="h-[11px] w-28 rounded bg-chrome" />
      </div>
    </div>
  );
}

export function SkeletonChip() {
  return <div className="inline-flex h-7 w-20 animate-pulse rounded-full bg-fill" />;
}

export function SkeletonArticleDetail() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-[13px] w-32 rounded bg-chrome" />
      <div className="h-[29px] w-3/4 rounded-md bg-fill" />
      <div className="h-[29px] w-1/2 rounded-md bg-fill" />
      <div className="mt-5 flex gap-4">
        <div className="h-[13px] w-20 rounded bg-chrome" />
        <div className="h-[13px] w-24 rounded bg-chrome" />
        <div className="h-[13px] w-16 rounded bg-chrome" />
      </div>
      <div className="mt-6 space-y-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`h-[15px] rounded bg-fill ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-line animate-pulse">
      <td className="h-[56px] px-4 align-middle">
        <div className="h-[13px] w-48 rounded bg-fill" />
      </td>
      <td className="h-[56px] px-4 align-middle">
        <div className="h-[13px] w-20 rounded bg-fill" />
      </td>
      <td className="h-[56px] px-4 align-middle">
        <div className="h-[13px] w-24 rounded bg-fill" />
      </td>
      <td className="h-[56px] px-4 align-middle">
        <div className="h-[13px] w-20 rounded bg-fill" />
      </td>
      <td className="h-[56px] px-4 align-middle">
        <div className="h-8 w-16 rounded-md bg-fill" />
      </td>
    </tr>
  );
}

