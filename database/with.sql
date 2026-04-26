with track_counts AS (
    select track_id, count(*) AS plays
    from history
    group by track_id
)
select t.title, tc.plays
from track_counts tc
join track t on t.track_id = tc.track_id;