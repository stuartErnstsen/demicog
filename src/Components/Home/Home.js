import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import BikeGalleryItem from './BikeGalleryItem/BikeGalleryItem';
import './Home.css';

const Home = props => {
    const [newBikeList, setNewBikeList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source();
        axios.get('/api/bikes', { cancelToken: cancelTokenSource.token })
            .then(res => {
                const bikeObj = res.data[1]
                const tempList = [...new Array(40)].map(e => bikeObj)
                setNewBikeList(tempList)
            })
            .catch(err => console.log(err))
        return () => {
            cancelTokenSource.cancel();
        }
    }, [])



    return (
        <main className="main-home">
            <section className="home-bike-list-container">
                {newBikeList.map(bikeObj => <BikeGalleryItem bike={bikeObj} />)}
            </section>

        </main >
    )
}

export default Home;