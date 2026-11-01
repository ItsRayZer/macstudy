import type { FigureSpec, FigureTable } from "@/src/content/types";

function TableView({ table }: { table: FigureTable }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[440px] border-collapse text-[13px] leading-[1.6]">
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="border-b-2 border-[var(--neon)]/40 px-3 py-2 text-left font-semibold text-[var(--text)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--glass-border)] last:border-0"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="whitespace-pre-line px-3 py-2 align-top text-[var(--text-dim)]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note ? (
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-faint)]">
          {table.note}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A labeled figure block: either an SVG diagram ("Diagram") or a data table
 * ("Table"). Glass card with a small uppercase label and a caption.
 */
export function Figure({ spec }: { spec: FigureSpec }) {
  const label = spec.kind === "svg" ? "Diagram" : "Table";
  return (
    <figure className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] p-5">
      <figcaption className="text-[11px] font-semibold uppercase tracking-widest text-[var(--neon)]">
        {label}
      </figcaption>
      <p className="mt-1 text-[13px] font-medium leading-[1.6] text-[var(--text)]">
        {spec.caption}
      </p>
      <div className="mt-3">
        {spec.kind === "svg" && spec.src ? (
          <img
            src={spec.src}
            alt={spec.alt ?? spec.caption}
            className="h-auto w-full"
            loading="lazy"
          />
        ) : null}
        {spec.kind === "table" && spec.table ? (
          <TableView table={spec.table} />
        ) : null}
      </div>
    </figure>
  );
}
