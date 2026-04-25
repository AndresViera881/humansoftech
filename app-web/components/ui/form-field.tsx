import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, note, children, className }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5${className ? ` ${className}` : ''}`}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {note && <span className="normal-case font-normal ml-1">{note}</span>}
      </Label>
      {children}
    </div>
  );
}
