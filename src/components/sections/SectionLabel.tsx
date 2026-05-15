interface Props {
  number: string;
  children: React.ReactNode;
}

// We render the heading as a div + role="heading" so consumers can inject animated
// wrappers (like ScrollFloat) that bring their own block-level element without
// nesting <h2> inside <h2>.
export const SectionLabel = ({ number, children }: Props) => (
  <div className="mb-12 flex items-center gap-4">
    <div role="heading" aria-level={2} className="text-lg font-bold text-text">
      {children}
    </div>
    <span className="h-px flex-1 bg-white/10" />
  </div>
);
