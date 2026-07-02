import { ProgressCard } from './ProgressCard';
import { getGoals } from '../../../lib/data';
import { EmptyState } from '../EmptyState';

export function SavingsGoals() {
  const goals = getGoals();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Savings Goals
      </h2>

      {goals.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
          const percentage = goal.current / goal.target;
          const status: 'on-track' | 'behind' | 'ahead' = 
            percentage >= 0.7 ? 'on-track' : percentage >= 0.4 ? 'behind' : 'ahead';
          
          return (
            <ProgressCard
              key={goal.id}
              title={goal.name}
              current={goal.current}
              target={goal.target}
              deadline={new Date(goal.deadline).toLocaleDateString()}
              status={status}
            />
          );
          })}
        </div>
      ) : (
        <EmptyState
          title="No savings goals yet"
          description="Create a goal after your first statement upload to start tracking progress."
        />
      )}
    </div>
  );
}
