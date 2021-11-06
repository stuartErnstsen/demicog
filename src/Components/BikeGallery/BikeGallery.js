import { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BikeListItem from '../BikeListItem/BikeListItem';
import './BikeGallery.css'

const BikeGallery = props => {
    const { user } = props
    const { page } = useParams()
    const [bikeList, setBikeList] = useState([])
    const [lastBikeId, setLastBikeId] = useState([]);
    const [cancelTokenSource] = useState(axios.CancelToken.source())
    const [uploadView, setUploadView] = useState(false)
    const [newBikeInputView, setNewBikeInputView] = useState(false)
    const [multiFilesInput, setMultiFilesInput] = useState([])
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const [totalItems, setTotalItems] = useState(0)
    const [prevButtonArr, setPrevButtonArr] = useState([])
    const [nextButtonArr, setNextButtonArr] = useState([])
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

    // const getBikeList = useCallback(() => {
    //     axios.get('/api/bikes')
    //         .then(res => setBikeList(res.data), { cancelToken: cancelTokenSource.token })
    //         .catch(err => console.log(err))
    // }, [cancelTokenSource.token])

    const initPaginationButtons = useCallback(() => {
        // let tempPrevButtonArr = []
        let tempNextButtonArr = []
        let count = 0
        // for (let i = +page - 1; i > 0 && count < 3; i--) {
        //     count++
        //     tempPrevButtonArr.unshift(
        //         <Link to={`/builds/page/${i}`} key={i}>
        //             <div className='paginate-btn-box'>
        //                 <h6>{i}</h6>
        //             </div>
        //         </Link>
        //     )
        // }
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        //NEED TO TEST THIS!!  VVVVVVVVVVVVVVVVV
        const tempPrevButtonArr = [...(new Array(+page > 3 ? 3 : +page - 1))].map((e, i) => {
            const pageNum = +page - (i + 1)
            return (
                <Link to={`/builds/page/${pageNum}`} key={pageNum}>
                    <div className='paginate-btn-box'>
                        <h6>{pageNum}</h6>
                    </div>
                </Link>
            )
        })
        count = 0;
        for (let i = +page + 1; i <= Math.ceil(totalItems / itemsPerPage) && count < 3; i++) {
            count++
            tempNextButtonArr.push(
                <Link to={`/builds/page/${i}`} key={i}>
                    <div className='paginate-btn-box'>
                        <h6>{i}</h6>
                    </div>
                </Link>
            )
        }
        setPrevButtonArr(tempPrevButtonArr)
        setNextButtonArr(tempNextButtonArr)
        // console.log({ totalItems })
        // console.log(Math.ceil(totalItems / itemsPerPage))
        // console.log({ page: +page + 1 })
        // console.log(tempNextButtonArr)
    }, [totalItems, itemsPerPage, page])

    const getBikeList = useCallback(() => {
        axios.post('/api/paginated-bikes', { page, itemsPerPage, cancelToken: cancelTokenSource.token })
            .then(res => {
                setBikeList(res.data)
                if (res.data[0]) {
                    setTotalItems(+res.data[0].full_count)
                }
            })
            .catch(err => console.log(err))
    }, [cancelTokenSource.token, page, itemsPerPage])


    const handleChange = (e) => {
        setBikeInput(old => ({ ...old, [e.target.name]: e.target.value }))
    }

    const handleBikeSubmit = (e) => {
        axios.post('/api/bikes', bikeInput)
            .then(res => {
                setLastBikeId(res.data.bike_id)
                getBikeList()
            })
            .catch(err => console.log(err))
        setUploadView(true)
    }

    const multipleFileUploadHandler = (e) => {
        e.preventDefault();
        const data = new FormData();
        let selectedFiles = multiFilesInput;
        // If file selected
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                data.append('galleryImage', selectedFiles[i], selectedFiles[i].name);
            }
            axios.post('/api/profile/multiple-file-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
                .then((response) => {
                    console.log('res', response);
                    if (200 === response.status) {
                        // If file size is larger than expected.
                        if (response.data.error) {
                            if ('LIMIT_FILE_SIZE' === response.data.error.code) {
                                alert('Max size: 2MB', 'red');
                            } else if ('LIMIT_UNEXPECTED_FILE' === response.data.error.code) {
                                alert('Max 4 images allowed', 'red');
                            } else {
                                // If not the given ile type
                                alert(response.data.error, 'red');
                            }
                        } else {
                            // Success
                            console.log('hEEEEEEEEEY', response.data)
                            let arr = response.data.locationArray;
                            arr.forEach(e => {
                                axios.post('/api/bikes/images', { bike_id: lastBikeId, url: e })
                                    .then(res => console.log(res.data))
                                    .catch(err => console.log(err))
                            })
                            console.log(arr);
                            alert('File Uploaded', '#3089cf');
                        }
                    }
                }).catch((error) => {
                    // If another error
                    alert(error, 'red');
                });
        } else {
            // if file not selected throw error
            alert('Please upload file', 'red');
        }
    };




    useEffect(() => {
        cancelTokenSource.cancel();
        getBikeList()
        return () => {
            cancelTokenSource.cancel();
        }

    }, [getBikeList, cancelTokenSource, page, itemsPerPage])

    useEffect(() => {
        if (totalItems > 0) {
            initPaginationButtons()
        }
    }, [totalItems, page, initPaginationButtons])


    useEffect(() => {
        console.log(multiFilesInput)
    }, [multiFilesInput])

    return (
        <>
            <main id='main-builds'>
                <section className='large-gallery'>
                    <div className='title-container'>
                        <h2>BUILDS</h2>
                        {bikeList[0] && (
                            <span>displaying {(+page - 1) * itemsPerPage + 1} - {+page * itemsPerPage >= totalItems ? totalItems : (+page - 1) * itemsPerPage + bikeList.length} out of {totalItems} Bikes</span>
                        )}
                    </div>
                    <div className='gallery-list'>
                        {bikeList.map(bike => {
                            return (
                                <BikeListItem key={bike.bike_id} bike={bike} getBikeListFn={getBikeList} cancelTokenSource={cancelTokenSource} />
                            )
                        })}
                    </div>
                    {bikeList[0] && (
                        <nav className="paginate-nav">
                            <div className="paginate-btn-container paginate-previous-container">
                                {+page > 1 &&
                                    <>
                                        <h5>&lt;</h5>
                                        {prevButtonArr}
                                    </>
                                }
                            </div>
                            <div className="paginate-current-container">
                                <h4>{+page}</h4>
                            </div>
                            <div className="paginate-btn-container paginate-next-container">
                                {+page <= (Math.floor(totalItems / itemsPerPage)) && (
                                    <>
                                        {nextButtonArr}
                                    </>
                                )}
                            </div>

                        </nav>
                    )}

                </section>
            </main>
            <div id='close-input-click-container' className={newBikeInputView ? '' : 'hide-bike-input'} onClick={(e) => {
                e.target.id === 'close-input-click-container' && setNewBikeInputView(!newBikeInputView)
            }}>
                <aside id='bike-input-container' className={newBikeInputView ? '' : 'hide-bike-input'}>
                    {user ? (
                        <>
                            <div id='bike-input-toggle-button' onClick={() => setNewBikeInputView(!newBikeInputView)}>
                                <div id='pulse-container' className='button-pulse'>
                                    <p id='pulse-text'>ADD BIKE</p>
                                    {newBikeInputView ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753l5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753l-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                                        </svg>
                                    )
                                    }

                                </div>
                            </div>
                            <form id='bike-form' onClick={() => setNewBikeInputView(true)}>
                                {!uploadView ? (
                                    <>
                                        <h3>UPLOAD YOUR BUILD!</h3>
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
                                        <h3>PHOTO UPLOAD</h3>
                                        <input type='file' multiple onChange={e => setMultiFilesInput([...multiFilesInput, ...e.target.files])} />
                                        <button onClick={e => multipleFileUploadHandler(e)}>UPLOAD IMAGES</button>
                                        <div className='img-preview-container'>
                                            {multiFilesInput.map(e => {
                                                return <img src={URL.createObjectURL(e)} />
                                            })}
                                        </div>
                                    </>

                                )

                                }
                                {!uploadView && <h3 id='create-btn' onClick={() => handleBikeSubmit()}>CREATE NEW BIKE</h3>}
                            </form>
                        </>

                    ) : (
                        <div id="login-prompt">
                            <h4>LOGIN TO UPLOAD BIKES!</h4>
                        </div>
                    )
                    }
                </aside>
            </div>

        </>


    )
}

const mapStateToProps = stateRedux => {
    return {
        user: stateRedux.userReducer.user
    }
}

export default connect(mapStateToProps)(BikeGallery);