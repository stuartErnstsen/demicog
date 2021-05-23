select c.text, b.title as bike_title, b.bike_id, c.comment_id, cl.title as class_title, cl.classified_id, u.username, u.profile_img, c.post_date from comment c 
left join bike b on b.bike_id = c.bike_id
left join classified cl on cl.classified_id = c.classified_id
left join users u on u.user_id = c.user_id
where (b.user_id = ${user_id} or cl.user_id = ${user_id})
and c.marked_as_read = false
order by c.post_date desc;


