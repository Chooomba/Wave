select
    u.username,
    p.name,
    t.title
from Users u
JOIN playlist p ON p.user_id = u.user_id
JOIN playlist_track pt ON pt.playlist_id = p.playlist_id
JOIN track t ON t.track_id = pt.track_id;