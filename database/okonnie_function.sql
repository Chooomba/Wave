-- RANK
select
    title,
    duration,
    rank() over (order by duration DESC)
from track;

-- ROW_NUMBER
select title, ROW_NUMBER() over () from track;

-- LAG / LEAD
select
    user_id,
    played_at,
    LAG(played_at) over (partition by user_id order by played_at),
    LEAD(played_at) over (partition by user_id order by played_at)
from history;

-- Накопительная сумма
select
    played_at::date,
    count(*) AS plays,
    SUM(count(*)) over (order by played_at::date)
from history
group by played_at::date;