import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  loading: boolean;
  loadingText?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function SaveButton({
  loading,
  loadingText = 'Guardando...',
  disabled,
  onClick,
  className,
  children,
}: SaveButtonProps) {
  return (
    <Button className={className} onClick={onClick} disabled={loading || disabled}>
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 rounded-full animate-spin border-primary-foreground/30 border-t-primary-foreground" />
          {loadingText}
        </span>
      ) : children}
    </Button>
  );
}
