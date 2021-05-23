import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import './MarketListItem.css'

const MarketListItem = props => {
    const { post, user, getPostListFn } = props;

    const [postImgArr, setPostImgArr] = useState([])

    const handlePostDelete = () => {
        axios.delete(`/api/post/${post.classified_id}`)
            .then(() => getPostListFn())
            .catch(err => console.log(err))
    }

    const getPostImages = useCallback((cancelToken) => {
        return axios.get(`/api/post/images/${post.classified_id}`, { cancelToken })
            .then(res => setPostImgArr(res.data))
            .catch(err => console.log(err))
    }, [post.classified_id])

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source();
        getPostImages(cancelTokenSource.token)
        return () => {
            cancelTokenSource.cancel();
        }
    }, [getPostImages])

    return (
        <div className='bike-item-container' key={post.classified_id}>
            <div className='bike-item-img-container'>
                <Link to={`/market/${post.classified_id}`}><img className='bike-list-img' src={postImgArr[0]?.url} alt={post.title} /></Link>
            </div>
            {
                user?.user_id === post.user_id && (
                    <button onClick={handlePostDelete}>
                        <DeleteForeverIcon />
                    </button>
                )
            }
            <div className='bike-item-info-container'>
                <h2><span>{post.title}</span></h2>
                <h5><span className='info-key'>TYPE: </span><span className='info-value'>{post.type}</span></h5>
                <h5><span className='info-key'>PRICE: </span><span className='info-value'>{post.price}</span></h5>
                <h5><span className='info-key'>DESCRIPTION: </span><span className='info-value'>{post.description}</span></h5>
            </div>

        </div >
    )
}

const mapStateToProps = stateRedux => {
    return {
        user: stateRedux.userReducer.user
    }
}

export default connect(mapStateToProps)(MarketListItem);