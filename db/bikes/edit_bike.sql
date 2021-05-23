update bike
set title = ${title},
    manufacturer = ${manufacturer},
    frame = ${frame},
    fork = ${fork},
    wheelset = ${wheelset},
    tires = ${tires},
    headset = ${headset},
    stem = ${stem},
    handlebars = ${handlebars},
    saddle = ${saddle},
    seatpost = ${seatpost},
    crankset = ${crankset},
    cog = ${cog},
    chain = ${chain},
    pedals = ${pedals}

where bike_id = ${bike_id}
returning bike_id;