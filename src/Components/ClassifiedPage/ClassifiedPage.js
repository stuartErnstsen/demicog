import { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import './ClassifiedPage.css'

const ClassifiedPage = props => {

    const { user } = props;
    const [loading, setLoading] = useState(true)
    const [classified, setClassified] = useState({});
    const [classifiedImgArr, setClassifiedImgArr] = useState([]);
    const [currentImg, setCurrentImg] = useState('');
    const [commentsArr, setCommentsArr] = useState();
    const parentType = 'classified';
    const [commentInput, setCommentInput] = useState();
    const [cancelTokenSource] = useState(axios.CancelToken.source())
    const [editView, setEditView] = useState(false)
    const { classifiedId } = props.match.params;

    const [classifiedInput, setClassifiedInput] = useState({
        title: '',
        type: '',
        price: '',
        description: '',
    })

    const handleChange = (e) => {
        setClassifiedInput({ ...classifiedInput, [e.target.name]: e.target.value })
    }

    const handleCommentSubmit = () => {
        if (!user) {
            return;
        }
        axios.post('/api/comments', { parentType, text: commentInput, id: classifiedId, cancelToken: cancelTokenSource.token })
            .then(res => {
                setCommentInput('')
                getComments()
            })
            .catch(err => console.log(err))
    }

    const handleEditClassified = () => {
        axios.put(`/api/market/${classified.classified_id}`, classifiedInput)
            .then(res => {
                getClassified()
                setEditView(false)
            })
            .catch(err => console.log(err))
    }

    const getComments = useCallback(() => {
        axios.get(`/api/comments/${classifiedId}`, { params: { parentType }, cancelToken: cancelTokenSource.token })
            .then(res => {
                setCommentsArr(res.data)
            })
            .catch(err => console.log('get comments hit:', err))
    }, [cancelTokenSource, classifiedId])

    const getClassifiedImages = useCallback(() => {
        axios.get(`/api/post/images/${classifiedId}`, { cancelToken: cancelTokenSource.token })
            .then(res => {
                setClassifiedImgArr(res.data)
                setCurrentImg(res.data[0]?.url)
                setLoading(false)
                getComments()
            })
            .catch(err => console.log(err))
    }, [classifiedId, getComments, cancelTokenSource])

    const getClassified = useCallback(() => {
        console.log(classifiedId)
        axios.get(`/api/post/${classifiedId}`, { cancelToken: cancelTokenSource.token })
            .then(res => {
                setClassified(res.data)
                setClassifiedInput(res.data)
            })
            .catch(err => console.log(err))
    }, [classifiedId, cancelTokenSource])

    useEffect(() => {
        getClassified()
        getClassifiedImages()
        return () => {
            cancelTokenSource.cancel();
        }
    }, [getClassified, getClassifiedImages, cancelTokenSource])

    return (
        <>
            <main id='main-market-profile' className='profile'>
                {loading ? (
                    <CircularProgress size='100px' />
                ) : (<>
                    <section className='large-gallery'>
                        <h3>OWNER: {classified.username}</h3>
                        <section className='page-image-primary-container'>
                            <img src={currentImg} alt={classified.title} />
                            <section className='page-image-gallery-thumbs'>
                                {classifiedImgArr?.map(img => {
                                    return <img
                                        key={img.img_id}
                                        src={img.url}
                                        alt={img.classified_id}
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
                                <h3>EDIT YOUR CLASSIFIED!</h3>
                                <input name='title' value={classifiedInput.title} onChange={handleChange} />
                                <select name='type' onChange={handleChange}>
                                    <option value=''>-PLEASE SELECT POST TYPE-</option>
                                    <option value='FS'>FOR SALE</option>
                                    <option value='WTB'>WANT TO BUY</option>
                                    <option value='LTT'>LOOKING TO TRADE</option>
                                </select>
                                <label>PRICE:</label>
                                <input name='price' value={classifiedInput.price} type='number' onChange={handleChange} />
                                <label>DESCRIPTION:</label>
                                <textarea name='description' value={classifiedInput.description} onChange={handleChange} maxLength='1000' />
                            </>
                        ) : (
                                <>
                                    <h2><span>{classified.title}</span></h2>
                                    <h5><span className='info-key'>TYPE: </span></h5>
                                    <p className='info-value'>{classified.type}</p>
                                    <h5><span className='info-key'>PRICE: </span></h5>
                                    <p className='info-value'>$ {classified.price}</p>
                                    <h5><span className='info-key'>DESCRIPTION: </span></h5>
                                    <p className='info-value'>{classified.description}</p>
                                </>
                            )

                        }
                        {user && user.user_id === classified.user_id && (
                            <>
                                {
                                    editView
                                        ? <button onClick={handleEditClassified}>SAVE</button>
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

export default connect(mapStateToProps)(ClassifiedPage);