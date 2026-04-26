-- UNION
select username from Users
union
select artist from track;

-- UNION ALL
select name from playlist where user_id = 1
union all
select name from playlist where user_id = 2;

-- INTERSECT
select track_id from playlist_track where playlist_id = 1
intersect
select track_id from playlist_track where playlist_id = 2;

-- EXCEPT
select track_id from playlist_track where playlist_id = 1
except
select track_id from playlist_track where playlist_id = 2;