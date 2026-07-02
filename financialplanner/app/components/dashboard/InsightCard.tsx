import { Card, CardHeader, CardContent } from '../ui/card';

interface InsightCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function InsightCard({ title, icon, children }: InsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon && <div className="text-zinc-500">{icon}</div>}
          <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
