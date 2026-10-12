import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { formatDate } from "@/lib/utils";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt?: string;
  image: string;
  category?: string;
  date?: string;
};

/** Blog card from the design: 240px cover, accent category · date, 20/700 title, excerpt. */
export function PostCard({ post, locale }: { post: PostCardData; locale: string }) {
  return (
    <article className="group flex flex-col gap-[18px]">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[411/240] overflow-hidden rounded-[14px] bg-surface">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 411px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex items-center gap-2.5">
        {post.category && (
          <>
            <span className="text-[11px] font-bold uppercase tracking-[1px] text-accent">{post.category}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted" />
          </>
        )}
        {post.date && (
          <time dateTime={post.date} className="text-[13px] text-muted">
            {formatDate(post.date, locale)}
          </time>
        )}
      </div>
      <Link href={`/blog/${post.slug}`}>
        <h3 className="m-0 text-xl font-bold leading-[1.3] tracking-[-0.3px] text-navy group-hover:text-accent">
          {post.title}
        </h3>
      </Link>
      {post.excerpt && <p className="m-0 line-clamp-3 text-[15px] leading-[1.55] text-muted">{post.excerpt}</p>}
    </article>
  );
}
