select *, count(*) OVER() AS full_count from bike
order by post_date desc
LIMIT ${itemsPerPage} OFFSET (${itemsPerPage} * (${page} - 1));
