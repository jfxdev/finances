import {
  House,
  Utensils,
  Car,
  HeartPulse,
  GraduationCap,
  PartyPopper,
  Repeat,
  Ellipsis,
  Video,
  Bot,
  Music,
  PiggyBank,
  ChartNoAxesCombined,
  Inbox,
  LoaderCircle,
} from 'lucide-react';
import type { icons } from '@finances/contracts';
import {
  Empty as EmptyRoot,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
export const iconMap = {
  house: House,
  utensils: Utensils,
  car: Car,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'party-popper': PartyPopper,
  repeat: Repeat,
  ellipsis: Ellipsis,
  video: Video,
  bot: Bot,
  music: Music,
  'piggy-bank': PiggyBank,
  'chart-no-axes-combined': ChartNoAxesCombined,
};
export function CategoryIcon({
  icon = 'ellipsis',
  color = '#17694e',
  variant = 'default',
}: {
  icon?: (typeof icons)[number];
  color?: string;
  variant?: 'default' | 'destructive';
}) {
  const Icon = iconMap[icon];
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl ${variant === 'destructive' ? 'bg-destructive/10 text-destructive' : ''}`}
      style={variant === 'destructive' ? undefined : { color, backgroundColor: `${color}16` }}
    >
      <Icon className="size-4" />
    </span>
  );
}
export function Empty({
  title = 'Nada por aqui ainda',
  description = 'Adicione seu primeiro registro para começar.',
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <EmptyRoot className="border bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </EmptyRoot>
  );
}
export function Loading() {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 p-10 text-muted-foreground"
    >
      <LoaderCircle className="size-5 animate-spin" />
      Carregando…
    </div>
  );
}
export function ErrorState({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <Card role="alert">
      <CardContent className="space-y-3 py-8">
        <p>{error.message}</p>
        <Button variant="outline" onClick={retry}>
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const mobile = useIsMobile();
  return mobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description ?? 'Preencha os dados abaixo.'}</DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[75dvh] overflow-y-auto px-4 safe-bottom">{children}</div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description ?? 'Preencha os dados abaixo.'}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
