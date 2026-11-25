const toolbarButton =
  "flex h-7 w-9 items-center justify-center rounded-md border border-line bg-paper text-[13px]";

export default function EditorMarkdown({
  id,
  placeholder,
  defaultValue,
}: {
  id: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <div className="w-full max-w-[800px] overflow-hidden rounded-md border border-line">
      <div className="flex h-8 items-stretch bg-chrome text-[13px]">
        <span className="flex items-center rounded-t-md bg-paper px-5">Tulis</span>
        <span className="flex items-center px-4 text-muted">Pratinjau</span>
      </div>

      <div className="flex h-10 items-center gap-1 border-b border-line px-3">
        <span className={toolbarButton}>H</span>
        <span className={toolbarButton}>B</span>
        <span className={toolbarButton}>I</span>
        <span className={toolbarButton}>&quot;</span>
        <span className={toolbarButton}>&lt;&gt;</span>
        <span className="flex h-7 w-16 items-center justify-center rounded-md border border-line bg-paper text-[13px]">
          Tautan
        </span>

        <span className="mx-3 h-4 w-px bg-line" aria-hidden />

        <span className={toolbarButton}>1.</span>
        <span className={toolbarButton}>•</span>
        <span className={toolbarButton}>&#10003;</span>

        <span className={`${toolbarButton} ml-auto`} aria-hidden>
          &#8630;
        </span>
        <span className={toolbarButton} aria-hidden>
          &#8631;
        </span>
      </div>

      <textarea
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="block h-[214px] w-full resize-none px-3 py-3 text-[13px] leading-5 placeholder:text-muted focus:outline-none"
      />

      <div className="flex h-8 items-center bg-chrome px-3 text-[13px] text-muted">
        Markdown didukung
      </div>
    </div>
  );
}
