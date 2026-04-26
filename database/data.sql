select
    title,
    UPPER(title),
    LOWER(artist),
    LENGTH(title),
    LEFT(title, 5)
from track;

select
    NOW(),
    TO_CHAR(NOW(), 'DD.MM.YYYY'),
    extract(year from NOW());

select
    duration,
    duration::FLOAT / 60 AS minutes
from track;