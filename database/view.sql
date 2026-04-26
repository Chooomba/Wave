create or replace view vw_userplaylisttracks AS
select
    u.username,
    p.name        AS playlist_name,
    p.created_at,
    t.title,
    t.artist,
    t.duration
from playlist p
join Users u ON u.user_id = p.user_id
join playlist_track pt ON pt.playlist_id = p.playlist_id
join track t ON t.track_id = pt.track_id;

create or replace view vw_listeninghistory AS
select
    u.username,
    t.title,
    t.artist,
    t.duration,
    h.played_at
from history h
join Users u ON u.user_id = h.user_id 
join track t  ON t.track_id = h.track_id