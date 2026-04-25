interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
      <span className="text-xs font-medium text-destructive">{message}</span>
    </div>
  );
}
