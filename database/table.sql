create table Users (
    user_id   SERIAL        primary key,
    username  VARCHAR(50)   not null unique,
    email     VARCHAR(100)  not null unique,
    password  VARCHAR(255)  not null
);

create table Track (
    track_id  SERIAL       primary key,
    title     VARCHAR(150) not null,
    artist    VARCHAR(100) not null,
    duration  INT          not null check (duration > 0)
);

create table Playlist (
    playlist_id  SERIAL       primary key,
    name         VARCHAR(100) not null,
    user_id      INT          not null,
    created_at   TIMESTAMP    not null default now(),
    constraint FK_Playlist_User foreign key (user_id)
        references Users(user_id) on delete cascade
);

create table Playlist_Track (
    id           SERIAL primary key,
    playlist_id  INT    not null,
    track_id     INT    not null,
    constraint FK_PT_Playlist foreign key (playlist_id)
       references Playlist(playlist_id) on delete cascade,
    constraint FK_PT_Track foreign key (track_id)
        references Track(track_id),
    constraint UQ_PT_Pair unique (playlist_id, track_id)
);

create table History (
    history_id  SERIAL    primary key,
    user_id     INT       not null,
    track_id    INT       not null,
    played_at   TIMESTAMP not null default NOW(),
    constraint FK_History_User  foreign key (user_id)
        references Users(user_id) on delete cascade,
    constraint FK_History_Track foreign key (track_id)
        references Track(track_id)
);