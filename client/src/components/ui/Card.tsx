export function Card({ children, className = "" }: any) {
  return (
    <div className={`rounded-2xl border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: any) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

