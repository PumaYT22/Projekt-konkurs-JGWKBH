import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import "./Calendar.css";

const Calendar = ({ setFilteredNotes, setIsDateFiltered, allNotes }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [animation, setAnimation] = useState('');
  const [notesCountByDay, setNotesCountByDay] = useState({});

  // Funkcja do pobrania dni w miesiącu
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Funkcja do pobrania pierwszego dnia miesiąca
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Poprzedni miesiąc
  const prevMonth = () => {
    setAnimation('slide-right');
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setAnimation('');
    }, 200);
  };

  // Następny miesiąc
  const nextMonth = () => {
    setAnimation('slide-left');
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setAnimation('');
    }, 200);
  };

  // Liczenie notatek dla każdego dnia w bieżącym miesiącu
  useEffect(() => {
    if (!allNotes || !allNotes.length) return;

    const countByDay = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    allNotes.forEach(note => {
      const noteDate = new Date(note.createdOn);
      if (noteDate.getFullYear() === year && noteDate.getMonth() === month) {
        const day = noteDate.getDate();
        countByDay[day] = (countByDay[day] || 0) + 1;
      }
    });

    setNotesCountByDay(countByDay);
  }, [allNotes, currentDate]);

  // Reset filtrowania
  const resetFilter = () => {
    setSelectedDate(null);
    setIsDateFiltered(false);
    setFilteredNotes([]);
  };

  // Obsługa kliknięcia dnia
  const handleDayClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Jeśli kliknięto już wybrany dzień, resetujemy filtr
    if (selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() && 
        selectedDate.getFullYear() === currentDate.getFullYear()) {
      resetFilter();
      return;
    }
    
    setSelectedDate(clickedDate);
    console.log('Wybrana data:', clickedDate.toLocaleDateString());
    
    // Filtrowanie notatek dla wybranego dnia
    const startOfDay = new Date(clickedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(clickedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const filtered = allNotes.filter(note => {
      const noteDate = new Date(note.createdOn);
      return noteDate >= startOfDay && noteDate <= endOfDay;
    });
    
    setFilteredNotes(filtered);
    setIsDateFiltered(true);
  };

  // Nazwy miesięcy po polsku
  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  // Nazwy dni tygodnia po polsku
  const dayNames = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];

  // Renderowanie dni kalendarza
  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Dodanie pustych miejsc dla dni z poprzedniego miesiąca
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10"></div>
      );
    }

    // Dodanie dni bieżącego miesiąca
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;
      
      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === month && 
                        selectedDate.getFullYear() === year;

      const hasNotes = notesCountByDay[day] > 0;

      days.push(
        <div 
          key={`day-${day}`} 
          onClick={() => handleDayClick(day)}
          className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-in-out relative
            ${isToday ? 'bg-blue-100 text-blue-800' : ''} 
            ${isSelected ? 'bg-blue-500 text-white transform scale-110' : 'hover:bg-blue-100'}`}
        >
          {day}
          {hasNotes && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg mb-6">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className={`grid grid-cols-7 gap-1 ${animation === 'slide-left' ? 'animate-slide-left' : animation === 'slide-right' ? 'animate-slide-right' : ''}`}>
          {renderDays()}
        </div>
        
        {selectedDate && (
          <div className="mt-4 text-center animate-fade-in">
            <div className="text-gray-600 font-medium">
              {selectedDate.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <button 
              onClick={resetFilter}
              className="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors duration-300"
            >
              Wyczyść filtr daty
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;