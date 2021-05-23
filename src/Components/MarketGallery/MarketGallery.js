import { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import MarketListItem from '../MarketListItem/MarketListItem';
import './MarketGallery.css'

const MarketGallery = props => {
    const { user } = props
    const [postList, setPostList] = useState([])
    const [lastPostId, setLastPostId] = useState([]);
    const [cancelTokenSource] = useState(axios.CancelToken.source())
    const [uploadView, setUploadView] = useState(false)
    const [newPostInputView, setNewPostInputView] = useState(false)
    const [buttonPulse, setButtonPulse] = useState(true)
    const [multiFilesInput, setMultiFilesInput] = useState([])
    const [postInput, setPostInput] = useState({
        title: '',
        type: '',
        price: '',
        description: ''
    })

    const getPostList = useCallback(() => {
        axios.get('/api/market')
            .then(res => setPostList(res.data), { cancelToken: cancelTokenSource.token })
            .catch(err => console.log(err))
    }, [cancelTokenSource.token])


    const handleChange = (e) => {
        setPostInput({ ...postInput, [e.target.name]: e.target.value })
    }

    const handlePostSubmit = (e) => {
        console.log(postInput.type)
        axios.post('/api/market', postInput)
            .then(res => {
                setLastPostId(res.data.classified_id)
                getPostList(cancelTokenSource.token)
                setUploadView(true)
            })
            .catch(err => console.log(err))

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
                                axios.post('/api/market/images', { classified_id: lastPostId, url: e })
                                    .then(res => console.log(res.data))
                                    .catch(err => console.log(err))
                            })
                            getPostList()
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
        getPostList()
        return () => {
            cancelTokenSource.cancel();
        }

    }, [getPostList, cancelTokenSource])


    useEffect(() => {
        const pulse = setTimeout(() => {
            setButtonPulse(!buttonPulse)
        }, 1000)
        return () => clearTimeout(pulse)

    }, [buttonPulse])

    return (
        <>
            <main id='main-builds'>
                <section className='large-gallery'>
                    <h2 className='title-container'>MARKET</h2>
                    <div className='gallery-list'>
                        {postList.map(post => {
                            return (
                                <MarketListItem key={post.classified_id} post={post} getPostListFn={getPostList} cancelTokenSource={cancelTokenSource} />
                            )
                        })}
                    </div>
                </section>
            </main>
            <div id='close-input-click-container' className={newPostInputView ? '' : 'hide-bike-input'} onClick={(e) => {
                e.target.id === 'close-input-click-container' && setNewPostInputView(!newPostInputView)
            }}>
                <aside id='bike-input-container' className={newPostInputView ? '' : 'hide-bike-input'}>
                    {user ? (
                        <>
                            <div id='bike-input-toggle-button' onClick={() => setNewPostInputView(!newPostInputView)}>
                                <div id='pulse-container' className={buttonPulse ? 'button-pulse' : ''}>
                                    <p id='pulse-text'>ADD POST</p>
                                    {newPostInputView ? (
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
                            <form id='bike-form' onClick={() => setNewPostInputView(true)}>
                                {!uploadView ? (
                                    <>
                                        <h3>UPLOAD YOUR BUILD!</h3>
                                        <label>POST TITLE:</label>
                                        <input name='title' value={postInput.title} onChange={handleChange} />
                                        <label>TYPE</label>
                                        <select name='type' onChange={handleChange}>
                                            <option defaultValue value=''>-PLEASE SELECT POST TYPE-</option>
                                            <option value='FS'>FOR SALE</option>
                                            <option value='WTB'>WANT TO BUY</option>
                                            <option value='LTT'>LOOKING TO TRADE</option>
                                        </select>
                                        <label>PRICE:</label>
                                        <input name='price' value={postInput.price} type='number' onChange={handleChange} />
                                        <label>DESCRIPTION:</label>
                                        <textarea name='description' value={postInput.description} onChange={handleChange} maxLength='1000' />
                                    </>
                                ) : (
                                        <>
                                            <h3>PHOTO UPLOAD</h3>
                                            <input type='file' multiple onChange={e => setMultiFilesInput([...e.target.files])} />
                                            <button onClick={e => multipleFileUploadHandler(e)}>UPLOAD IMAGES</button>
                                            <div className='img-preview-container'>
                                                {multiFilesInput.map(e => JSON.stringify(e))}
                                            </div>
                                        </>

                                    )

                                }
                                {!uploadView && <h3 id='create-btn' onClick={() => handlePostSubmit()}>CREATE NEW POST</h3>}
                            </form>
                        </>

                    ) : (
                            <div id="login-prompt">
                                <h4>LOGIN TO ADD POST!</h4>
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

export default connect(mapStateToProps)(MarketGallery);