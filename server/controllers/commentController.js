
module.exports = {
    addComment: async (req, res) => {
        const { parentType, id, text } = req.body
        const { user_id } = req.session.user
        const db = req.app.get('db')
        const bikeId = parentType === 'bike' ? id : null
        const classifiedId = parentType === 'classified' ? id : null
        const [comment] = await db.comments.add_comment({ user_id, parentType, bikeId, classifiedId, id, text })
        res.sendStatus(201)
    },
    getPageComments: async (req, res) => {
        const { parentType } = req.query
        const { id } = req.params
        const db = req.app.get('db')
        const commentArr = await db.comments.get_page_comments({ parentType, id: +id })
        res.status(200).send(commentArr)
    },
    getCommentFeed: async (req, res) => {
        const { user_id } = req.session.user;
        const db = req.app.get('db')
        const feed = await db.comments.get_comment_feed({ user_id })
        res.status(200).send(feed)
    },
    deleteComment: async (req, res) => {
        const { id } = req.params;
        const { user_id } = req.session.user;
        const db = req.app.get('db')
        await db.comments.delete_comment({ id: +id })
        const feed = await db.comments.get_comment_feed({ user_id })
        res.status(200).send(feed)
    },
    markCommentRead: async (req, res) => {
        const { id } = req.params;
        const { user_id } = req.session.user;
        const db = req.app.get('db')
        await db.comments.mark_comment_read({ id: +id })
        const feed = await db.comments.get_comment_feed({ user_id })
        res.status(200).send(feed)
    }
}