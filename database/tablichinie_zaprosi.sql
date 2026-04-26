-- FROM
select *from (select title, duration from track order by duration desc limit 3) t;

-- WHERE
select username from Users
where user_id IN (select user_id from playlist);

-- HAVING
select playlist_id, count(*)
from playlist_track
group by playlist_id
having count(*) > (
    select avg(cnt)
    from (select count(*) cnt from playlist_track group by playlist_id) s);