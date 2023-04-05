SELECT 
	MAX(session_time) as 'session_time',
	DATEDIFF(hour, GETDATE(), session_date) as 'time_hour_difference',
	DATEDIFF(day, GETDATE(), session_date) as 'time_day_difference',
	DATEDIFF(month, GETDATE(), session_date) as 'time_month_difference'
FROM [smartace.analytics.sessionTime]
WHERE 
	session_time != 0
GROUP BY session_token, session_date
ORDER BY session_date ASC