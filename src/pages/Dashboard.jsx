import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrend from '../components/dashboard/BalanceTrend';
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function Dashboard() {
  return (
    <div>
      <SummaryCards />
      <div className="charts-row">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <RecentTransactions />
    </div>
  );
}
