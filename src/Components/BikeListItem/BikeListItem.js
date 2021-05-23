import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import './BikeListItem.css'

const BikeListItem = props => {
    const { bike, user, getBikeListFn } = props;

    const [bikeImgArr, setBikeImgArr] = useState([])

    const handleBikeDelete = () => {
        axios.delete(`/api/bike/${bike.bike_id}`)
            .then(() => getBikeListFn())
            .catch(err => console.log(err))
    }

    const getBikeImages = useCallback((cancelToken) => {
        return axios.get(`/api/bike/images/${bike.bike_id}`, { cancelToken })
            .then(res => setBikeImgArr(res.data))
            .catch(err => console.log(err))
    }, [bike.bike_id])

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source();
        getBikeImages(cancelTokenSource.token)
        return () => {
            cancelTokenSource.cancel();
        }
    }, [getBikeImages])

    return (
        <div className='bike-item-container' key={bike.bike_id}>
            <div className='bike-item-img-container'>
                <Link to={`/builds/${bike.bike_id}`}><img className='bike-list-img' src={bikeImgArr[0]?.url} alt={bike.name} /></Link>
            </div>
            {
                user?.user_id === bike.user_id && (
                    <button onClick={handleBikeDelete}>
                        <DeleteForeverIcon />
                    </button>
                )
            }
            <div className='bike-item-info-container'>
                <h2><span>{bike.title}</span></h2>
                <h5><span className='info-key'>MANUFACTURER: </span><span className='info-value'>{bike.manufacturer}</span></h5>
                <h5><span className='info-key'>FRAME: </span><span className='info-value'>{bike.frame}</span></h5>
                <h5><span className='info-key'>COG: </span><span className='info-value'>{bike.cog}</span></h5>
            </div>

        </div >
    )
}

const mapStateToProps = stateRedux => {
    return {
        user: stateRedux.userReducer.user
    }
}

export default connect(mapStateToProps)(BikeListItem);