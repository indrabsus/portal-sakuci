function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function InitialsAvatar({
  name,
  fotoUrl,
  className,
}: {
  name: string;
  fotoUrl?: string | null;
  className?: string;
}) {
  const cls = className ?? "size-10 text-sm";

  if (fotoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fotoUrl}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${cls}`}
      />
    );
  }

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ${cls}`}>
      {getInitials(name)}
    </div>
  );
}
