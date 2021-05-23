insert into classified (
    user_id,
    title,
    price,
    type,
    post_date,
    description
) values (
    ${user_id},
    ${title},
    ${price},
    ${type},
    CURRENT_TIMESTAMP,
    ${description}
)

returning classified_id;