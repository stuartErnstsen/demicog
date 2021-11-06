import { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import CommentItem from './CommentItem/CommentItem';
import './Header.css';
import demicogLogo from '../../Assets/demicogWEB.png'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
// import demicogLogoWHITE from '../../Assets/demicogWEB_WHITE.png'

const Header = props => {
    const { user, commentFeed } = props
    const [commentFeedView, setCommentFeedView] = useState(false)
    return (
        <>

            <header>

                <div className='header-left-container'>
                    <Link to='/' >
                        <div id='logo-container'>
                            <img id='header-logo' src={demicogLogo} alt='DEMICOG LOGO' />
                        </div>
                    </Link>
                    <Link to='/' >
                        <h1 id='header-title'>DEMICOG</h1>
                    </Link>
                    <nav id='main-nav'>
                        <Link to='/'><p>HOME</p></Link>
                        <Link to={`/builds/page/${1}`}><p id='nav-lines'>BUILDS</p></Link>
                        <Link to='/market'><p>MARKET</p></Link>
                    </nav>
                </div>
                {user !== null &&
                    <>
                        <div id='user-info-container'>
                            <h2><span>{user.username}</span> : </h2>
                            <img id='profile-img' alt={user.username} src={user.profile_img} />
                        </div>
                        <section id='new-comment-feed' className={commentFeedView ? '' : 'hide-comment-feed'}>
                            <div className='comment-display'>
                                {commentFeed?.map(comment => {
                                    return (
                                        <CommentItem key={comment.comment_id} comment={comment} />
                                    )
                                })}
                            </div >
                            <div>
                                {commentFeedView
                                    ? <h3 className='comment-feed-toggle-btn' onClick={() => setCommentFeedView(!commentFeedView)}><CancelPresentationIcon fontSize='large' /></h3>
                                    : <h3 className='comment-feed-toggle-btn' onClick={() => setCommentFeedView(!commentFeedView)}><MailOutlineIcon fontSize='large' /></h3>
                                }

                            </div>
                        </section >
                    </>

                }
                <Login />
            </header >
        </>

    )
}

const mapStateToProps = stateRedux => {
    return {
        user: stateRedux.userReducer.user,
        commentFeed: stateRedux.commentReducer.commentFeed
    }
}

export default connect(mapStateToProps)(Header);