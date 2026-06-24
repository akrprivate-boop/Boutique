import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parseISO
} from 'date-fns';
import { orderService } from '../../services/orderService';
import { formatDateISO } from '../../utils/formatters';
import CalendarDay from './CalendarDay';
import DayDetailTable from './DayDetailTable';
import '../../styles/calendar.css';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const data = await orderService.getDeliveriesForMonth(year, month);
      setEvents(data);
    } catch (error) {
      console.error("Failed to load calendar events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <div className="calendar-month-year">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <div className="calendar-nav">
          <button className="calendar-today-btn" onClick={goToToday}>Today</button>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="calendar-nav-btn" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <button className="calendar-nav-btn" onClick={nextMonth} aria-label="Next month">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekdays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="calendar-weekdays">
        {days.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>
    );
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateStr = formatDateISO(day);
        const dayEvents = events.filter(e => e.delivery_date === dateStr);
        
        days.push(
          <CalendarDay
            key={day.toString()}
            day={day}
            monthStart={monthStart}
            selectedDate={selectedDate}
            onDateClick={setSelectedDate}
            events={dayEvents}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-days" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-grid-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      <div className="calendar-grid">
        {renderWeekdays()}
        {renderDays()}
      </div>
      
      <div className="day-detail-section">
        <DayDetailTable 
          selectedDate={selectedDate} 
          key={formatDateISO(selectedDate)} // Force re-render on date change
          onStatusChange={loadEvents} 
        />
      </div>
    </div>
  );
}
