export type MarqueeTextProps = {
  text: string;
  direction?: number;
};

export function MarqueeText({ text, direction = 1 }: MarqueeTextProps) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className="inline-flex"
        style={{
          animation: `marquee-scroll 20s linear infinite${direction > 0 ? "" : " reverse"}`,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
