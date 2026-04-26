select
    u.username,
    count(*) filter (where t.artist = 'Queen') AS queen,
    count(*) filter (where t.artist = 'Nirvana') AS nirvana,
    count(*) filter (where t.artist = 'Eagles') AS eagles
from history h
join Users u ON u.user_id = h.user_id
join track t ON t.track_id = h.track_id
group by u.username;