SELECT 
	MAX(session_time) as 'session_time',
	session_date
FROM [smartace.analytics.sessionTime]
WHERE 
	session_time != 0
GROUP BY session_token, session_date
ORDER BY session_date ASC