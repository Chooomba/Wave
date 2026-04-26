create or replace function sp_registeruser(
    p_username VARCHAR,
    p_email    VARCHAR,
    p_password VARCHAR
)
returns INT AS $$
declare new_id INT;
begin
    if exists (select 1 from Users where email = p_email) then
        raise exception 'Email уже занят';
    end if;

    insert into Users (username, email, password)
    values (p_username, p_email, p_password)
    returning user_id into new_id;

    return new_id;
end;
$$ LANGUAGE plpgsql;


create or replace function sp_addtracktoplaylist(
    p_playlist_id INT,
    p_track_id INT
)
returns VOID AS $$
begin
    if exists (
        select 1 from playlist_track
        where playlist_id = p_playlist_id
          and track_id = p_track_id
    ) then
        raise exception 'Трек уже есть в плейлисте';
    end if;

    insert into playlist_track (playlist_id, track_id)
    values (p_playlist_id, p_track_id);
end;
$$ LANGUAGE plpgsql;


create or replace function sp_logplay(
    p_user_id INT,
    p_track_id INT
)
returns VOID AS $$
begin
    insert into history (user_id, track_id, played_at)
    values (p_user_id, p_track_id, NOW());
end;
$$ LANGUAGE plpgsql;


create or replace function fn_formatduration(seconds INT)
returns TEXT AS $$
begin
   return LPAD((seconds / 60)::TEXT, 2, '0')
           || ':' ||
           LPAD((seconds % 60)::TEXT, 2, '0');
end;
$$ LANGUAGE plpgsql;


create or replace function fn_playlisttrackcount(p_playlist_id INT)
returns INT AS $$
begin
    return (
        select count(*)
        from playlist_track
        where playlist_id = p_playlist_id
    );
end;
$$ LANGUAGE plpgsql;