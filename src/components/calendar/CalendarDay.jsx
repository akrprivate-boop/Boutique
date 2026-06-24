import { isSameMonth, isSameDay, format } from 'date-fns';

export default function CalendarDay({ day, monthStart, selectedDate, onDateClick, events }) {
  const isSelected = isSameDay(day, selectedDate);
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, monthStart);
  const hasEvents = events.length > 0;

  return (
    <div
      className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
      onClick={() => onDateClick(day)}
    >
      <div className="calendar-day-number">
        {format(day, 'd')}
      </div>
      
      <div className="calendar-events-container">
        {events.slice(0, 3).map((event, idx) => (
          <div key={event.id} className="calendar-event">
            {event.customer?.name}
          </div>
        ))}
        {events.length > 3 && (
          <div className="calendar-event-more">
            + {events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
