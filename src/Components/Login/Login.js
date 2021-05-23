import { useEffect, useState, } from 'react';
import { connect } from 'react-redux';
import { setUser } from '../../ducks/Reducers/userReducer';
import { setCommentFeed } from '../../ducks/Reducers/commentReducer';
import { CountryDropdown, RegionDropdown, } from 'react-country-region-selector';
import axios from 'axios';
import './Login.css';

const Login = props => {
    const [input, setInput] = useState({
        userOrEmail: '',
        username: '',
        email: '',
        verifyEmail: '',
        password: '',
        verifyPassword: '',
        country: '',
        region: '',
        profileImg: ''
    })
    const [showLoginErr, setShowLoginErr] = useState(false)
    const [loginErr, setLoginErr] = useState('')
    const [loginErrTimeout, setLoginErrTimeout] = useState()
    const [submitType, setSubmitType] = useState('login')
    const [selectedFile, setSelectedFile] = useState('')

    const { user, setUser, setCommentFeed } = props;

    useEffect(() => {
        axios.get('/auth/user')
            .then(res => {
                setSubmitType('logout')
                setUser(res.data)
            })
            .catch(err => console.log(err))
    }, [setUser])

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source()
        if (user) {
            axios.get('/api/comment-feed', { cancelToken: cancelTokenSource.token })
                .then(res => {
                    console.log(res.data)
                    setCommentFeed(res.data)
                })
                .catch(err => console.log(err))
        }

        return () => {
            cancelTokenSource.cancel()
        }
    }, [user, setCommentFeed])

    useEffect(() => {
        return () => clearTimeout(loginErrTimeout)
    }, [loginErrTimeout])

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const resetInput = () => {
        setInput({
            userOrEmail: '',
            username: '',
            email: '',
            verifyEmail: '',
            password: '',
            verifyPassword: '',
            country: '',
            region: '',
            profileImg: ''
        })
    }

    const loginErrAlert = (errText) => {
        setLoginErr(errText)
        setShowLoginErr(true)
        setLoginErrTimeout(setTimeout(() => {
            setShowLoginErr(false)
        }, 1000 * 8))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('HIT AFTER FOR IN LOOP')

        if (submitType === 'login') {
            const { userOrEmail, password } = input
            axios.post('/auth/login', { userOrEmail, password })
                .then((res) => {
                    setSubmitType('logout')
                    resetInput()
                    props.setUser(res.data)
                })
                .catch(err => {
                    loginErrAlert(err.response.data)
                })
        } else if (submitType === 'register') {
            for (let key in input) {
                if (input[key] === '' && key !== 'userOrEmail' && key !== 'profileImg') {
                    return loginErrAlert(`${key} IS REQUIRED`)
                }
                if (key === 'username') {
                    const regEx = /^[a-zA-Z0-9-]{4,20}$/
                    if (!input[key].match(regEx)) {
                        return loginErrAlert('USERNAME MUST 4-20 CHARACTERS LONG AND NOT INCLUDE ANY SPECIAL CHARACTERS')
                    }
                }
                if (key === 'email') {
                    const regEx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
                    if (!input[key].match(regEx)) {
                        return loginErrAlert('INVALID EMAIL: (example@email.com)')
                    }
                    if (input.email !== input.verifyEmail) {
                        return loginErrAlert('EMAILS DO NOT MATCH')
                    }
                }
                if (key === 'password') {
                    const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                    if (!input[key].match(regEx)) {
                        return loginErrAlert('Passwword must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters')
                    }
                    if (input.password !== input.verifyPassword) {
                        return loginErrAlert('PASSWORDS DO NOT MATCH')
                    }
                }
            }
            axios.post('/auth/register', { ...input })
                .then((res) => {
                    setSubmitType('logout')
                    resetInput()
                    props.setUser(res.data)
                })
                .catch(err => {
                    loginErrAlert(err.response.data)
                })
        } else if (submitType === 'logout') {
            axios.get('/auth/logout')
                .then(res => {
                    setSubmitType('login')
                    props.setUser(null)
                })
                .catch(err => console.log('Hit: LOGOUT ', err))
        }
    }

    const singleFileUploadHandler = () => {
        const data = new FormData();// If file selected
        if (selectedFile) {
            data.append('profileImage', selectedFile, selectedFile.name);
            axios.post('/api/profile/profile-img-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
                .then((response) => {
                    if (200 === response.status) {
                        // If file size is larger than expected.
                        if (response.data.error) {
                            if ('LIMIT_FILE_SIZE' === response.data.error.code) {
                                alert('Max size: 2MB', 'red');
                            } else {
                                console.log(response.data);// If not the given file type
                                alert(response.data.error, 'red');
                            }
                        } else {
                            // Success
                            let imgData = response.data;
                            console.log('imgData', imgData);
                            setInput({ ...input, profileImg: imgData.location })
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

    return (
        <nav className="login-nav">
            <form>
                {user === null &&
                    <div id='login-input-container'>
                        <h3 className={`login-err ${showLoginErr ? 'show-login-err' : ''} ${submitType === 'register' ? 'reg-err' : ''}`}>{loginErr}</h3>
                        <input required placeholder='EMAIL/USERNAME' value={input.userOrEmail} name="userOrEmail" onChange={handleChange} />
                        <input required id='password-input' placeholder='PASSWORD' value={input.password} name="password" type="password" onChange={handleChange} />
                    </div>
                }
                <div id='form-btn-container'>
                    <button
                        id='login-btn-container'
                        type='submit'
                        onClick={handleSubmit}
                        className={`nav-btn-container ${submitType === 'login' ? 'show-nav-btn-container' : ''}`}>
                        LOGIN
                    </button>
                    <button
                        id='register-btn-container'
                        type='submit'
                        className={`nav-btn-container ${submitType === 'register' ? 'show-nav-btn-container' : ''}`}
                        onClick={handleSubmit}>
                        REGISTER
                    </button>
                    <div
                        id='logout-btn-container'
                        type='submit'
                        className={`nav-btn-container ${submitType === 'logout' ? 'show-nav-btn-container' : ''}`}
                        onClick={handleSubmit}>
                        LOGOUT
                    </div>
                </div>
            </form>
            {user === null &&
                <div id='reg-section-container' className={submitType === 'register' ? 'show-reg-input' : ''}>
                    <div
                        id='reg-toggle-container'
                        onClick={() => setSubmitType(submitType === 'login' ? 'register' : 'login')}>
                        {submitType === 'login'
                            ? <p >NOT REGISTERED? CLICK HERE!</p>
                            : <p >HAVE AN ACCOUNT? CLICK HERE!</p>
                        }
                    </div>
                    <div id='reg-input-container'>

                        <input
                            required
                            pattern="[a-z0-9-].{4,20}" title="4-20 regular characters"
                            placeholder='*USERNAME'
                            value={input.username}
                            name='username'
                            onChange={handleChange} />
                        <input
                            required
                            type='email'
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            placeholder='*EMAIL'
                            value={input.email}
                            name='email'
                            onChange={handleChange} />
                        <input
                            required
                            placeholder='*RE-ENTER EMAIL'
                            value={input.verifyEmail}
                            name='verifyEmail'
                            onChange={handleChange} />
                        <input
                            required
                            type='password'
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                            placeholder='*PASSWORD'
                            value={input.password}
                            name='password'
                            onChange={handleChange} />
                        <input
                            required
                            type='password'
                            placeholder='*RE-ENTER PASSWORD'
                            value={input.verifyPassword}
                            name='verifyPassword'
                            onChange={handleChange} />
                        <CountryDropdown value={input.country} onChange={val => setInput({ ...input, country: val })} />
                        <RegionDropdown value={input.region} country={input.country} onChange={val => setInput({ ...input, region: val })} />
                        <input type='file' name='profileImg' onChange={e => setSelectedFile(e.target.files[0])} />
                        <button onClick={singleFileUploadHandler}>UPLOAD IMAGE</button>
                    </div>
                </div>
            }

        </nav>
    )
}

const mapStateToProps = stateRedux => {
    return {
        user: stateRedux.userReducer.user
    }
}

export default connect(mapStateToProps, { setUser, setCommentFeed })(Login);