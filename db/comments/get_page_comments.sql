select c.*, u.username, u.profile_img, u.country, u.region from comment c
join users u on c.user_id = u.user_id
where parent_type = ${parentType}
and (bike_id = ${id} or classified_id = ${id})
order by c.post_date desc;