interface TableLoadingProps {
  card?: boolean;
  className?: string;
}

export function TableLoading({ card, className }: TableLoadingProps) {
  return (
    <div className={`flex items-center justify-center py-16 gap-3 bg-white${card ? ' rounded-2xl border' : ''}${className ? ` ${className}` : ''}`}>
      <div className="w-5 h-5 rounded-full border-2 animate-spin border-border border-t-foreground" />
      <span className="text-sm text-muted-foreground">Cargando...</span>
    </div>
  );
}

interface TableEmptyProps {
  message?: string;
  icon?: React.ReactNode;
  card?: boolean;
  className?: string;
}

function DefaultIcon() {
  return (
    <svg className="w-10 h-10 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}

export function TableEmpty({ message = 'Sin registros', icon, card, className }: TableEmptyProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-2 bg-white${card ? ' rounded-2xl border' : ''}${className ? ` ${className}` : ''}`}>
      {icon ?? <DefaultIcon />}
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

export function PackageIcon() {
  return (
    <svg className="w-10 h-10 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    </svg>
  );
}
