update classified
set title = ${title},
    price = ${price},
    type = ${type},
    description = ${description}
where classified_id = ${classified_id};