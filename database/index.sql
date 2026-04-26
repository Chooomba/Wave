CREATE INDEX ix_playlist_user_id ON playlist (user_id);
CREATE INDEX ix_playlisttrack_playlist ON playlist_track (playlist_id);
CREATE INDEX ix_playlisttrack_track ON playlist_track (track_id);
CREATE INDEX ix_history_user_id ON history (user_id);
CREATE INDEX ix_history_track_id ON history (track_id);
CREATE INDEX ix_history_played_at ON history (played_at DESC);
CREATE INDEX ix_track_artist ON track (artist);