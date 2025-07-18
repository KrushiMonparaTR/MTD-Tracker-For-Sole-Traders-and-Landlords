import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const MTDDeadlineWidget = ({ currentBusiness, currentQuarter }) => {
  // MTD Quarterly deadlines for 2025/26 UK tax year
  const mtdDeadlines = [
    {
      quarter: 'Q1',
      period: '6 Apr 2025 - 5 Jul 2025',
      deadline: '2025-08-07',
      deadlineText: '7 August 2025'
    },
    {
      quarter: 'Q2', 
      period: '6 Jul 2025 - 5 Oct 2025',
      deadline: '2025-11-07',
      deadlineText: '7 November 2025'
    },
    {
      quarter: 'Q3',
      period: '6 Oct 2025 - 5 Jan 2026',
      deadline: '2026-01-07',
      deadlineText: '7 January 2026'
    },
    {
      quarter: 'Q4',
      period: '6 Jan 2026 - 5 Apr 2026',
      deadline: '2026-05-07',
      deadlineText: '7 May 2026'
    }
  ];

  // For calendar year businesses, adjust the deadlines
  const calendarDeadlines = [
    {
      quarter: 'Q1',
      period: '1 Jan 2025 - 31 Mar 2025',
      deadline: '2025-05-07',
      deadlineText: '7 May 2025'
    },
    {
      quarter: 'Q2',
      period: '1 Apr 2025 - 30 Jun 2025', 
      deadline: '2025-08-07',
      deadlineText: '7 August 2025'
    },
    {
      quarter: 'Q3',
      period: '1 Jul 2025 - 30 Sep 2025',
      deadline: '2025-11-07', 
      deadlineText: '7 November 2025'
    },
    {
      quarter: 'Q4',
      period: '1 Oct 2025 - 31 Dec 2025',
      deadline: '2026-02-07',
      deadlineText: '7 February 2026'
    }
  ];

  const deadlines = currentBusiness?.calendarElection ? calendarDeadlines : mtdDeadlines;
  const today = new Date();
  
  // Find current and next deadlines
  const upcomingDeadlines = deadlines
    .map(deadline => ({
      ...deadline,
      deadlineDate: new Date(deadline.deadline),
      daysUntil: Math.ceil((new Date(deadline.deadline) - today) / (1000 * 60 * 60 * 24))
    }))
    .filter(deadline => deadline.daysUntil >= -30) // Show deadlines up to 30 days past
    .sort((a, b) => a.deadlineDate - b.deadlineDate);

  const nextDeadline = upcomingDeadlines.find(deadline => deadline.daysUntil >= 0);
  const currentQuarterDeadline = deadlines.find(d => d.quarter === currentQuarter?.quarter);

  const getDeadlineStatus = (daysUntil) => {
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 7) return 'urgent';
    if (daysUntil <= 30) return 'warning';
    return 'normal';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'urgent':
        return <Clock className="h-4 w-4 text-orange-400" />;
      case 'warning':
        return <Calendar className="h-4 w-4 text-yellow-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'border-red-500 bg-red-900/20';
      case 'urgent':
        return 'border-orange-500 bg-orange-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/20';
      default:
        return 'border-slate-600 bg-slate-800';
    }
  };

  const getStatusText = (daysUntil) => {
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil === 0) return 'Due today';
    if (daysUntil === 1) return 'Due tomorrow';
    return `${daysUntil} days remaining`;
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${getStatusColor(nextDeadline ? getDeadlineStatus(nextDeadline.daysUntil) : 'normal')}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">MTD Deadlines</h3>
        </div>
        <div className="text-xs text-slate-400">
          {currentBusiness?.calendarElection ? 'Calendar Year' : 'Standard Tax Year'}
        </div>
      </div>

      {/* Next Deadline */}
      {nextDeadline && (
        <div className="mb-4 p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(getDeadlineStatus(nextDeadline.daysUntil))}
              <span className="font-medium text-white">Next Deadline</span>
            </div>
            <span className="text-sm text-slate-300">{nextDeadline.quarter}</span>
          </div>
          <div className="text-sm text-slate-300 mb-1">
            Period: {nextDeadline.period}
          </div>
          <div className="text-sm font-medium text-white">
            Due: {nextDeadline.deadlineText}
          </div>
          <div className={`text-sm font-medium mt-1 ${
            getDeadlineStatus(nextDeadline.daysUntil) === 'overdue' ? 'text-red-400' :
            getDeadlineStatus(nextDeadline.daysUntil) === 'urgent' ? 'text-orange-400' :
            getDeadlineStatus(nextDeadline.daysUntil) === 'warning' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {getStatusText(nextDeadline.daysUntil)}
          </div>
        </div>
      )}

      {/* All Quarters Overview */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300 mb-3">2025/26 Tax Year Schedule</h4>
        {deadlines.map((deadline, index) => {
          const daysUntil = Math.ceil((new Date(deadline.deadline) - today) / (1000 * 60 * 60 * 24));
          const status = getDeadlineStatus(daysUntil);
          const isCurrentQuarter = deadline.quarter === currentQuarter?.quarter;
          
          return (
            <div
              key={deadline.quarter}
              className={`flex items-center justify-between p-2 rounded text-sm ${
                isCurrentQuarter ? 'bg-blue-900/30 border border-blue-600' : 'bg-slate-750'
              }`}
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon(status)}
                <span className={`font-medium ${isCurrentQuarter ? 'text-blue-300' : 'text-slate-300'}`}>
                  {deadline.quarter}
                </span>
                <span className="text-slate-400">
                  {deadline.deadlineText}
                </span>
              </div>
              <div className={`text-xs ${
                status === 'overdue' ? 'text-red-400' :
                status === 'urgent' ? 'text-orange-400' :
                status === 'warning' ? 'text-yellow-400' :
                'text-slate-400'
              }`}>
                {daysUntil >= 0 ? `${daysUntil}d` : `${Math.abs(daysUntil)}d overdue`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Notes */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-200">
            <p className="font-medium mb-1">Important:</p>
            <ul className="space-y-1 text-blue-300">
              <li>• Submissions must be made through compatible software</li>
              <li>• Late submissions may incur penalties from HMRC</li>
              <li>• Allow time for software processing before deadlines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MTDDeadlineWidget;
