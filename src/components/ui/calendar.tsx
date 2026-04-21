import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import type { DropdownProps } from 'react-day-picker'

import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CalendarDropdown({
  options,
  value,
  disabled,
  onChange,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const selectedValue = value === undefined ? undefined : String(value)

  return (
    <Select
      value={selectedValue}
      onValueChange={(nextValue) => {
        onChange?.({
          target: { value: nextValue },
          currentTarget: { value: nextValue },
        } as React.ChangeEvent<HTMLSelectElement>)
      }}
      disabled={disabled}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-9 min-w-0 rounded-md px-3 py-2"
      >
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const isDropdownCaption =
    props.captionLayout === 'dropdown' ||
    props.captionLayout === 'dropdown-months' ||
    props.captionLayout === 'dropdown-years'

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: 'rounded-xl bg-card text-card-foreground',
        months: 'flex flex-col gap-4 sm:flex-row',
        month: 'space-y-4',
        month_caption: 'flex min-h-9 items-center justify-center',
        caption_label: isDropdownCaption
          ? 'sr-only'
          : 'text-sm font-semibold text-foreground',
        dropdowns: 'flex w-full items-center justify-center gap-2',
        dropdown_root: 'min-w-0 flex-1',
        dropdown: 'min-w-0',
        months_dropdown: 'appearance-none',
        years_dropdown: 'appearance-none',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'absolute left-0 size-8 rounded-full border-border bg-background p-0 text-slate-600 hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'absolute right-0 size-8 rounded-full border-border bg-background p-0 text-slate-600 hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'w-9 text-[0.8rem] font-medium text-muted-foreground',
        weeks: 'mt-2 flex flex-col gap-1',
        week: 'flex w-full',
        day: 'h-9 w-9 p-0 text-center text-sm',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 rounded-full p-0 font-normal text-foreground transition-colors hover:rounded-full hover:bg-primary/10 hover:text-primary focus-visible:rounded-full focus-visible:bg-primary/10 focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 aria-selected:opacity-100',
        ),
        range_start: 'day-range-start',
        range_end: 'day-range-end',
        selected:
          'rounded-full bg-primary/20 text-primary hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary',
        today: 'text-primary font-semibold',
        outside:
          'text-muted-foreground opacity-45 aria-selected:bg-primary/10 aria-selected:text-muted-foreground aria-selected:opacity-70',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-primary/10 aria-selected:text-primary',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Dropdown: CalendarDropdown,
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) =>
          orientation === 'left' ? (
            <ChevronLeft className={cn('size-4', iconClassName)} {...iconProps} />
          ) : (
            <ChevronRight
              className={cn('size-4', iconClassName)}
              {...iconProps}
            />
          ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
