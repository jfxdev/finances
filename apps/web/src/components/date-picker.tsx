import { useState, type Ref } from 'react';
import { format, parseISO, endOfMonth } from 'date-fns';
import { ptBR } from 'react-day-picker/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const firstMonth = new Date(1900, 0);
const lastMonth = new Date(new Date().getFullYear() + 100, 11);

export function DatePicker({
  id,
  value,
  onChange,
  onBlur,
  ref,
  min,
  max,
  readOnly = false,
  disabled = false,
  clearable = false,
  invalid = false,
}: {
  id: string;
  value?: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
  ref?: Ref<HTMLButtonElement>;
  min?: string;
  max?: string;
  readOnly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          ref={ref}
          type="button"
          variant="outline"
          disabled={disabled || readOnly}
          aria-invalid={invalid || undefined}
          onBlur={onBlur}
          className={`min-h-11 w-full justify-between font-normal ${!value ? 'text-muted-foreground' : ''}`}
        >
          {selected ? format(selected, 'dd/MM/yyyy') : 'Selecione uma data'}
          <CalendarIcon className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          required
          locale={ptBR}
          captionLayout="dropdown"
          startMonth={firstMonth}
          endMonth={lastMonth}
          defaultMonth={selected ?? (min ? parseISO(min) : undefined)}
          selected={selected}
          disabled={[
            ...(min ? [{ before: parseISO(min) }] : []),
            ...(max ? [{ after: parseISO(max) }] : []),
          ]}
          onSelect={(date) => {
            onChange(format(date, 'yyyy-MM-dd'));
            setOpen(false);
          }}
          autoFocus
        />
        {clearable && value && (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              Limpar data
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function MonthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const start = parseISO(`${value}-01`);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" aria-label="Mês de referência" className="bg-card">
          <CalendarIcon className="size-4" />
          {format(start, 'MMMM yyyy', { locale: ptBR })}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="range"
          locale={ptBR}
          captionLayout="dropdown"
          startMonth={firstMonth}
          endMonth={lastMonth}
          defaultMonth={start}
          selected={{ from: start, to: endOfMonth(start) }}
          onDayClick={(date) => {
            onChange(format(date, 'yyyy-MM'));
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
