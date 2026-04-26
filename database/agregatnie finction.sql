select
    artist,
    count(*) AS cnt,
    AVG(duration) AS avg_duration,
    SUM(duration) AS total_duration
from track
group by artist
having count(*) > 1;