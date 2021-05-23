import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import './MarketGalleryItem.css'

const MarketGalleryItem = props => {
    const { post } = props
    const [postImg, setPostImg] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const tokenSource = axios.CancelToken.source()
        axios.get(`/api/post/images/${post.classified_id}`, { cancelToken: tokenSource.token })
            .then(res => {
                setPostImg(res.data[0]?.url)
                setLoading(false)
            })
            .catch(err => console.log(err))

        return () => {
            tokenSource.cancel()
        }
    }, [post.classified_id])


    return (

        !loading && (
            <Link to={`/market/${post.classified_id}`}>
                <div className='img-gal-container' key={post.classified_id}>
                    <div className='market-info'>
                        <h5>{post.title}</h5>
                        <h5>{post.type}</h5>
                        <h5>$ {parseInt(post.price).toFixed(2)} </h5>
                    </div>
                    <img src={postImg} alt={post.title} />
                </div>
            </Link>
        )

    )
}

export default MarketGalleryItem;