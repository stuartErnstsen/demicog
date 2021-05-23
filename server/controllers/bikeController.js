
module.exports = {
    getAllBikes: async (req, res) => {
        const db = req.app.get('db')
        const bikeList = await db.bikes.get_all_bikes()
        res.status(200).send(bikeList)
    },
    getAllBikesPaginated: async (req, res) => {
        const { page, itemsPerPage } = req.body
        const db = req.app.get('db')
        try {
            const bikeList = await db.bikes.get_all_bikes_paginated({ page, itemsPerPage })
            res.status(200).send(bikeList)
        } catch (err) {
            console.log(err)
            res.sendStatus(409)
        }

    },
    getBike: async (req, res) => {
        const { id } = req.params
        const db = req.app.get('db')
        const [bike] = await db.bikes.get_bike(id)
        res.status(200).send(bike)
    },
    addBike: async (req, res) => {
        const bikeObj = req.body
        const { user_id } = req.session.user

        const db = req.app.get('db');

        const [addedBikeId] = await db.bikes.add_bike({ ...bikeObj, user_id })
        res.status(201).send(addedBikeId)
    },
    addBikeImage: async (req, res) => {
        const { bike_id, url } = req.body;
        const db = req.app.get('db');

        const [addedImage] = await db.bikes.add_bike_img({ bike_id, url })
        res.status(201).send(addedImage)
    },
    getBikeImages: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db')

        const images = await db.bikes.get_bike_images({ id })

        res.status(200).send(images)
    },
    deleteBike: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        await db.bikes.delete_bike({ id });
        res.sendStatus(200);
    },
    getShowcaseBikes: async (req, res) => {
        const db = req.app.get('db')

        const showcaseBikes = await db.bikes.random_bikes()

        res.status(200).send(showcaseBikes)
    },
    editBike: async (req, res) => {
        const bikeObj = req.body
        const db = req.app.get('db')

        await db.bikes.edit_bike(bikeObj)

        res.sendStatus(200)
    }

}