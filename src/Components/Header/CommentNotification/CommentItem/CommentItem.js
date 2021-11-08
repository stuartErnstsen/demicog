import { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCommentFeed } from '../../../../ducks/Reducers/commentReducer'
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

const CommentItem = props => {
    const { comment, setCommentFeed } = props;
    const [showFeedBtns, setShowFeedBtns] = useState(false)

    const handleDeleteComment = () => {
        axios.delete(`/api/comment/${comment.comment_id}`)
            .then((res) => {
                console.log('delete success')
                setCommentFeed(res.data)
            })
            .catch(err => console.log(err))
    }

    const handleMarkAsRead = () => {
        axios.put(`/api/comment/${comment.comment_id}`)
            .then((res) => {
                console.log('marked-success')
                setCommentFeed(res.data)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='comment' onMouseEnter={() => setShowFeedBtns(true)} onMouseLeave={() => setShowFeedBtns(false)}>
            <div className='comment-btn-container'>
                <div className={`comment-btn ${showFeedBtns ? 'show-feed-btn' : ''}`} onClick={handleMarkAsRead}><DoneOutlineIcon /></div>
                <div className={`comment-btn ${showFeedBtns ? 'show-feed-btn' : ''}`} onClick={handleMarkAsRead}><SaveIcon /></div>
                <div className={`comment-btn ${showFeedBtns ? 'show-feed-btn' : ''}`} onClick={handleDeleteComment}><DeleteForeverIcon /></div>
            </div>

            <img className='comment-profile-picture' src={comment.profile_img} alt={comment.username} />
            <h3> : {comment.username} </h3>
            <span>
                (ON POST: <Link to={comment.bike_title != null ? `/builds/${comment.bike_id}` : `/market/${comment.classified_id}`}>{
                    comment.bike_title !== null
                        ? comment.bike_title
                        : comment.class_title
                }
                </Link>)
            </span>

            <p>{comment.text}</p>
        </div>
    )
}

export default connect(null, { setCommentFeed })(CommentItem);