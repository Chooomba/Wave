-- EXISTS
select username
from Users u
where exists (
    select 1 from playlist p where p.user_id = u.user_id
);

-- NOT EXISTS
select title
from track t
where not exists (
    select 1 from playlist_track pt where pt.track_id = t.track_id
);

-- ALL
select *
from track
where duration > all (
    select duration from track where artist = 'Nirvana'
);

-- ANY
select *
from track
where duration > any (
    select duration from track where artist = 'Nirvana'
);