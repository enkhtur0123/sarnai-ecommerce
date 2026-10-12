/** FAQ accordion — renders CMS `h3` (question) + following HTML (answer) as distinct cards. */
export type FaqItem = { question: string; answerHtml: string };

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/** Split `<h3>Q</h3><p>A</p>...` CMS HTML into question/answer pairs. */
export function parseFaqContent(html: string): FaqItem[] {
  const items: FaqItem[] = [];
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<h3[^>]*>|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const question = stripTags(m[1]);
    const answerHtml = m[2].trim();
    if (question) items.push({ question, answerHtml });
  }
  return items;
}

export default function FaqList({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <details
          key={`${i}-${item.question.slice(0, 24)}`}
          open={i === 0}
          className="faq-item group rounded-2xl border border-line bg-white transition-shadow open:border-navy open:shadow-[0_12px_32px_rgba(28,26,26,0.08)]"
        >
          <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-extrabold text-white"
            >
              Q
            </span>
            <span className="flex-1 text-[16px] font-extrabold leading-snug text-navy">
              {item.question}
            </span>
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-5">
            <div className="flex items-start gap-3 rounded-xl border-l-4 border-accent bg-surface px-4 py-3.5">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-extrabold text-accent ring-1 ring-line"
              >
                A
              </span>
              <div
                className="faq-answer min-w-0 flex-1 text-[15px] font-normal leading-relaxed text-muted"
                dangerouslySetInnerHTML={{ __html: item.answerHtml || "<p>—</p>" }}
              />
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
