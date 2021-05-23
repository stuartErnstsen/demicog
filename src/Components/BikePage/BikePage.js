import { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import './BikePage.css'

const BikeProfile = props => {

    const { user } = props;
    const [loading, setLoading] = useState(true)
    const [bike, setBike] = useState({});
    const [bikeImgArr, setBikeImgArr] = useState([]);
    const [currentImg, setCurrentImg] = useState('');
    const [commentsArr, setCommentsArr] = useState();
    const parentType = 'bike';
    const [commentInput, setCommentInput] = useState();
    const [cancelTokenSource] = useState(axios.CancelToken.source())
    const [editView, setEditView] = useState(false)
    const { bikeId } = props.match.params;

    const [bikeInput, setBikeInput] = useState({
        title: '',
        manufacturer: '',
        frame: '',
        fork: '',
        wheelset: '',
        tires: '',
        headset: '',
        stem: '',
        handlebars: '',
        saddle: '',
        seatpost: '',
        crankset: '',
        cog: '',
        chain: '',
        pedals: ''
    })

    const handleChange = (e) => {
        setBikeInput({ ...bikeInput, [e.target.name]: e.target.value })
    }

    const handleCommentSubmit = () => {
        if (!user) {
            return;
        }
        axios.post('/api/comments', { parentType, text: commentInput, id: bike.bike_id, cancelToken: cancelTokenSource.token })
            .then(res => {
                setCommentInput('')
                getComments()
            })
            .catch(err => console.log(err))
    }

    const handleEditBike = () => {
        axios.put(`/api/bike/${bike.bike_id}`, bikeInput)
            .then(res => {
                getBike()
                setEditView(false)
            })
            .catch(err => console.log(err))
    }

    // const createCancelToken = useCallback(() => {
    //     setCancelTokenSource(axios.CancelToken.source())
    // }, [])

    const getComments = useCallback(() => {
        axios.get(`/api/comments/${bikeId}`, { params: { parentType }, cancelToken: cancelTokenSource.token })
            .then(res => {
                setCommentsArr(res.data)
            })
            .catch(err => console.log('get comments hit:', err))
    }, [cancelTokenSource, bikeId])

    const getBikeImages = useCallback(() => {
        axios.get(`/api/bike/images/${bikeId}`, { cancelToken: cancelTokenSource.token })
            .then(res => {
                setBikeImgArr(res.data)
                setCurrentImg(res.data[0]?.url)
                setLoading(false)
                getComments()
            })
            .catch(err => console.log(err))
    }, [bikeId, getComments, cancelTokenSource])

    const getBike = useCallback(() => {
        axios.get(`/api/bike/${bikeId}`, { cancelToken: cancelTokenSource.token })
            .then(res => {
                setBike(res.data)
                setBikeInput(res.data)
            })
            .catch(err => console.log(err))
    }, [bikeId, cancelTokenSource])


    useEffect(() => {
        getBike()
        getBikeImages()
    }, [getBike, getBikeImages, getComments])
    // console.log(props)
    useEffect(() => {
        return () => {
            cancelTokenSource.cancel();
        }
    }, [cancelTokenSource])

    return (
        <>
            <main id='main-build-profile' className='profile'>
                {loading ? (
                    <CircularProgress size='100px' />
                ) : (<>
                    <section className='large-gallery'>
                        <h3>OWNER: {bike.username}</h3>
                        <section className='page-image-primary-container'>
                            <img src={currentImg} alt={bike.title} />
                            <section className='page-image-gallery-thumbs'>
                                {bikeImgArr?.map(img => {
                                    return <img
                                        key={img.img_id}
                                        src={img.url}
                                        alt={img.bike_id}
                                        onClick={() => setCurrentImg(img.url)} />
                                })

                                }
                            </section>
                        </section>
                        <h3>COMMENTS:</h3>
                        <section className='comment-container'>
                            <div className='comment-display'>
                                {commentsArr?.map(comment => {
                                    return (
                                        <div className='comment' key={comment.comment_id}>
                                            <img className='comment-profile-picture' src={comment.profile_img} alt={comment.username} />
                                            <h3> : {comment.username}</h3>
                                            <p>{comment.text}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='comment-input-container'>
                                {user ? (
                                    <>
                                        <textarea className='comment-input' value={commentInput} placeholder='Please enter a new comment!' onChange={(e) => setCommentInput(e.target.value)} />
                                    </>

                                ) : (
                                        <>
                                            <div className='comment-input'>PLEASE LOGIN TO COMMENT</div>
                                        </>
                                    )

                                }
                                <button onClick={handleCommentSubmit}>SUBMIT</button>
                            </div>

                        </section>
                    </section>

                    <section className='large-gallery page-info-container bike-item-info-container'>
                        {editView ? (
                            <>
                                <h3>EDIT YOUR BUILD!</h3>
                                <label>BIKE NAME:</label>
                                <input name='title' value={bikeInput.title} onChange={handleChange} />
                                <label>MANUFACTURER:</label>
                                <input name='manufacturer' value={bikeInput.manufacturer} onChange={handleChange} />
                                <label>FRAME:</label>
                                <input name='frame' value={bikeInput.frame} onChange={handleChange} />
                                <label>FORK:</label>
                                <input name='fork' value={bikeInput.fork} onChange={handleChange} />
                                <label>HEADSET:</label>
                                <input name='headset' value={bikeInput.headset} onChange={handleChange} />
                                <label>WHEELSET:</label>
                                <input name='wheelset' value={bikeInput.wheelset} onChange={handleChange} />
                                <label>TIRES:</label>
                                <input name='tires' value={bikeInput.tires} onChange={handleChange} />
                                <label>STEM:</label>
                                <input name='stem' value={bikeInput.stem} onChange={handleChange} />
                                <label>HANDLEBARS:</label>
                                <input name='handlebars' value={bikeInput.handlebars} onChange={handleChange} />
                                <label>SADDLE:</label>
                                <input name='saddle' value={bikeInput.saddle} onChange={handleChange} />
                                <label>SEATPOST:</label>
                                <input name='seatpost' value={bikeInput.seatpost} onChange={handleChange} />
                                <label>CRANKSET:</label>
                                <input name='crankset' value={bikeInput.crankset} onChange={handleChange} />
                                <label>PEDALS:</label>
                                <input name='pedals' value={bikeInput.pedals} onChange={handleChange} />
                                <label>COG:</label>
                                <input name='cog' value={bikeInput.cog} onChange={handleChange} />
                                <label>CHAIN:</label>
                                <input name='chain' value={bikeInput.chain} onChange={handleChange} />
                            </>
                        ) : (
                                <>
                                    <h2><span>{bike.title}</span></h2>
                                    <h3><span className='info-key'>MANUFACTURER: </span> <span className='info-value'>{bike.manufacturer}</span></h3>
                                    <h3><span className='info-key'>FRAME: </span> <span className='info-value'>{bike.frame}</span></h3>
                                    <h3><span className='info-key'>FORK: </span> <span className='info-value'>{bike.fork}</span></h3>
                                    <h3><span className='info-key'>HEADSET: </span> <span className='info-value'>{bike.headset}</span></h3>
                                    <h3><span className='info-key'>WHEELSET: </span> <span className='info-value'>{bike.wheelset}</span></h3>
                                    <h3><span className='info-key'>TIRES: </span> <span className='info-value'>{bike.tires}</span></h3>
                                    <h3><span className='info-key'>STEM: </span> <span className='info-value'>{bike.stem}</span></h3>
                                    <h3><span className='info-key'>HANDLEBARS: </span> <span className='info-value'>{bike.handlebars}</span></h3>
                                    <h3><span className='info-key'>SADDLE: </span> <span className='info-value'>{bike.saddle}</span></h3>
                                    <h3><span className='info-key'>SEATPOST: </span> <span className='info-value'>{bike.seatpost}</span></h3>
                                    <h3><span className='info-key'>CRANKSET: </span> <span className='info-value'>{bike.crankset}</span></h3>
                                    <h3><span className='info-key'>PEDALS: </span> <span className='info-value'>{bike.pedals}</span></h3>
                                    <h3><span className='info-key'>COG: </span> <span className='info-value'>{bike.cog}</span></h3>
                                    <h3><span className='info-key'>CHAIN: </span> <span className='info-value'>{bike.chain}</span></h3>
                                </>
                            )

                        }
                        {user && user.user_id === bike.user_id && (
                            <>
                                {
                                    editView
                                        ? <button onClick={handleEditBike}>SAVE</button>
                                        : <button onClick={() => setEditView(true)}>EDIT</button>
                                }
                            </>

                        )
                        }


                    </section>
                </>
                    )

                }


            </main>

        </>


    )

}

const mapStateToProps = stateRedux => {
    return {
        user: stateRedux.userReducer.user
    }
}

export default connect(mapStateToProps)(BikeProfile);