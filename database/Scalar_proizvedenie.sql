-- WHERE
select title, duration
from track
where duration > (select AVG(duration) from track);

-- SELECT
select
    title,
    duration,
    (select MAX(duration) from track) AS max_duration
from track;

-- HAVING
select artist, count(*)
from track
group by artist
having count(*) > (
    select AVG(cnt)
    from (select count(*) AS cnt from track group by artist) t
);