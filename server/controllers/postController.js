
module.exports = {
    getAllPosts: async (req, res) => {
        const db = req.app.get('db')
        const postList = await db.posts.get_all_posts()
        res.status(200).send(postList)
    },
    getPost: async (req, res) => {
        const { id } = req.params
        const db = req.app.get('db')
        const [post] = await db.posts.get_post(id)
        res.status(200).send(post)
    },
    addPost: async (req, res) => {
        const postObj = req.body
        const { user_id } = req.session.user

        const db = req.app.get('db');

        const [addedPostId] = await db.posts.add_post({ ...postObj, user_id })
        res.status(201).send(addedPostId)
    },
    addPostImage: async (req, res) => {
        const { classified_id, url } = req.body;
        const db = req.app.get('db');

        const [addedImage] = await db.posts.add_post_img({ classified_id, url })
        res.status(201).send(addedImage)
    },
    getPostImages: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db')

        const images = await db.posts.get_post_images({ id })

        res.status(200).send(images)
    },
    deletePost: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        await db.posts.delete_post({ id });
        res.sendStatus(200);
    },
    editPost: async (req, res) => {
        const postObj = req.body
        const db = req.app.get('db')

        await db.posts.edit_post(postObj)

        res.sendStatus(200)
    }


}