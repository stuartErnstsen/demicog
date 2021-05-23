import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BikeGalleryItem from './BikeGalleryItem/BikeGalleryItem';
import MarketGalleryItem from './MarketGalleryItem/MarketGalleryItem';
import ShowcaseBike from './ShowcaseBike/ShowcaseBike';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Home.css';

const Home = props => {
    const [list, setList] = useState([])
    const [marketList, setMarketList] = useState([])
    const [showcase, setShowcase] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source();

        axios.get('/api/showcase', { cancelToken: cancelTokenSource.token })
            .then(res => {
                setShowcase(res.data)
                setLoading(false)
            })
            .catch(err => console.log(err))
        axios.get('/api/bikes', { cancelToken: cancelTokenSource.token })
            .then(res => setList(res.data))
            .catch(err => console.log(err))

        axios.get('/api/market', { cancelToken: cancelTokenSource.token })
            .then(res => setMarketList(res.data))
            .catch(err => console.log(err))
        return () => {
            cancelTokenSource.cancel();
        }
    }, [])

    return (
        <main id="main-home">
            <div id='home-content-container'>
                <section id="bike-showcase-container">
                    <p>Welcome to <span>DEMICOG</span>! A commune for track bikes and their owners. Check out bike <Link to={`/builds/page/${1}`}><span>BUILDS</span></Link> by the community or submit your own! Got some dusty parts in the back of your closet? Some shiny parts you no longer love? Throw em' up on the <Link to='/market'><span>MARKET</span></Link> and make the big bucks!</p>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <h4>RANDOM SPOTLIGHT</h4>
                            <div id='bike-container' className=''>
                                <ShowcaseBike bike={showcase[0]} />
                                <ShowcaseBike bike={showcase[1]} />
                            </div>
                        </>

                    )

                    }

                </section>

                <section id='gallery-container'>
                    <div id='build-mini-gallery' className='gallery'>
                        <Link to={`/builds/page/${1}`}><h2 className='title-container'>BUILDS</h2></Link>
                        <div className='containerrr'>
                            {list.map(bike => {
                                return <BikeGalleryItem key={bike.bike_id} bike={bike} />
                            })}
                        </div>
                    </div>
                    <div id='market-mini-gallery' className='gallery'>
                        <Link to='/market'><h2 className='title-container'>MARKET</h2></Link>
                        <div className='containerrr'>
                            {marketList.map(post => <MarketGalleryItem key={post.classified_id} post={post} />)}
                        </div>
                    </div>
                </section>

            </div>

        </main >
    )
}

export default Home;