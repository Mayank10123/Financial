import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', message = 'Try adjusting your filters or add new data.' }) {
  return (
    <div className="empty-state">
      <Icon size={64} strokeWidth={1} />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
