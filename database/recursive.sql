with recursive numbers AS (
    select 1 AS n
    union ALL
    select n + 1 from numbers where n < 10
)
select * from numbers;