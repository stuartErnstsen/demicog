import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import './ShowcaseBike.css';

const ShowcaseBike = props => {
    const { bike } = props

    const [bikeImg, setBikeImg] = useState('')
    const [loading, setLoading] = useState(true)
    const [infoView, setInfoView] = useState(false)

    useEffect(() => {
        const tokenSource = axios.CancelToken.source()
        if (bike) {
            axios.get(`/api/bike/images/${bike.bike_id}`, { cancelToken: tokenSource.token })
                .then(res => {
                    setBikeImg(res.data[0]?.url)
                    setLoading(false)
                })
                .catch(err => console.log(err))
        }
        return () => {
            tokenSource.cancel()
        }
    }, [bike])

    return (
        <div className='showcase-bike-item-container'>
            {bike && (
                <Link to={`/builds/${bike.bike_id}`}><h3>{bike.title}</h3></Link>
            )}
            {loading
                ? <CircularProgress />
                : <img src={bikeImg} alt={bike.title} />}
            <section className={`showcase-bike-info ${infoView ? 'show-bike-info' : ''}`} onClick={() => setInfoView(!infoView)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
                </svg>
                {infoView && (
                    <div>
                        <h4>MANUFACTURER:</h4>
                        <h5>{bike.manufacturer}</h5>
                        <h4>FRAME:</h4>
                        <h5>{bike.frame}</h5>
                        <h4>CRANKSET:</h4>
                        <h5>{bike.crankset}</h5>
                        <h4>WHEELSET:</h4>
                        <h5>{bike.wheelset}</h5>
                        <h4>COG:</h4>
                        <h5>{bike.cog}</h5>
                    </div>
                )}
            </section>
        </div>
    )
}

export default ShowcaseBike;