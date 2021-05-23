import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const BikeGalleryItem = props => {
    const { bike } = props
    const [bikeImg, setBikeImg] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const tokenSource = axios.CancelToken.source()
        axios.get(`/api/bike/images/${bike.bike_id}`, { cancelToken: tokenSource.token })
            .then(res => {
                setBikeImg(res.data[0]?.url)
                setLoading(false)
            })
            .catch(err => console.log(err))

        return () => {
            tokenSource.cancel()
        }
    }, [bike.bike_id])


    return (

        loading ? (
            <CircularProgress />
        ) : (
                <Link to={`/builds/${bike.bike_id}`}>
                    <div className='img-gal-container' key={bike.bike_id}>
                        {/* <h4>{bike.title}</h4> */}
                        <img src={bikeImg} alt={bike.title} />
                    </div>
                </Link>
            )

    )
}

export default BikeGalleryItem;