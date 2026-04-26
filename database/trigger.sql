-- Запрет дублей
create or replace function trg_pt_noduplicates()
returns trigger AS $$
begin
    if exists (
        select 1 from playlist_track
        where playlist_id = NEW.playlist_id
          and track_id = NEW.track_id
    ) then
        return null;
    end if;

    return new;
end;
$$ LANGUAGE plpgsql;

create trigger trg_pt_noduplicates
before insert on playlist_track
for each row
execute function trg_pt_noduplicates();


-- Очистка при удалении плейлиста
create or replace function trg_playlist_cleanup()
returns trigger AS $$
begin
    delete from playlist_track where playlist_id = OLD.playlist_id;
    return old;
end;
$$ LANGUAGE plpgsql;

create trigger trg_playlist_cleanup
before insert on playlist
for each row
execute function trg_playlist_cleanup();


-- Логирование прослушивания
create or replace function trg_pt_logplay()
returns trigger AS $$
begin
    insert into history(user_id, track_id, played_at)
    select p.user_id, NEW.track_id, NOW()
    from playlist p
    where p.playlist_id = NEW.playlist_id;

    return new;
end;
$$ LANGUAGE plpgsql;

create trigger trg_pt_logplay
after insert on playlist_track
for each row
execute function trg_pt_logplay();