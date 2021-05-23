insert into comment (
    user_id,
    post_date,
    parent_type,
    classified_id,
    bike_id,
    text,
    marked_as_read
) values (
    ${user_id},
    CURRENT_TIMESTAMP,
    ${parentType},
    ${classifiedId},
    ${bikeId},
    ${text},
    false
)

returning *;