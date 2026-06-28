import { useState } from 'react';
import Header from '../components/layout/Header';
import TabNav from '../components/layout/TabNav';
import SummaryCards from '../components/dashboard/SummaryCards';
import RevenueChart from '../components/dashboard/RevenueChart';
import CustomerForm from '../components/forms/CustomerForm';
import Calendar from '../components/calendar/Calendar';
import CustomerTable from '../components/tables/CustomerTable';
import Loader from '../components/common/Loader';
import { useOrders } from '../hooks/useOrders';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { orders, summary, isLoading, loadOrders, refresh } = useOrders();

  const handleOrderCreated = () => {
    refresh();
    setActiveTab('database');
  };

  return (
    <div className="app-layout">
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="app-content">
        {activeTab === 'overview' && (
          <div className="dashboard-section">
            <h2 className="section-title">Business Overview</h2>
            {isLoading && !summary ? (
              <Loader text="Calculating statistics..." />
            ) : (
              <>
                <SummaryCards summary={summary} />
                <RevenueChart data={summary?.monthlyRevenue} />
              </>
            )}
          </div>
        )}

        {activeTab === 'entry' && (
          <div className="dashboard-section">
            <h2 className="section-title">New Customer Order</h2>
            <CustomerForm onOrderCreated={handleOrderCreated} />
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="dashboard-section">
            <h2 className="section-title">Delivery Schedule</h2>
            <Calendar />
          </div>
        )}

        {activeTab === 'database' && (
          <div className="dashboard-section">
            <h2 className="section-title">Master Database</h2>
            <CustomerTable 
              orders={orders} 
              onRefresh={loadOrders} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </main>
    </div>
  );
}
