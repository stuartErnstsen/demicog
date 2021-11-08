import { useState } from "react";
import { connect } from "react-redux";
import CommentItem from "./CommentItem/CommentItem";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

const CommentNotification = (props) => {
  const { user, commentFeed } = props;
  const [commentFeedView, setCommentFeedView] = useState(false);
  return (
    user !== null && (
      <>
        <div id="user-info-container">
          <h2>
            <span>{user.username}</span> :{" "}
          </h2>
          <img id="profile-img" alt={user.username} src={user.profile_img} />
        </div>
        <section
          id="new-comment-feed"
          className={commentFeedView ? "" : "hide-comment-feed"}
        >
          <div className="comment-display">
            {commentFeed?.map((comment) => {
              return <CommentItem key={comment.comment_id} comment={comment} />;
            })}
          </div>
          <div>
            <h3
              className="comment-feed-toggle-btn"
              onClick={() => setCommentFeedView(!commentFeedView)}
            >
              {commentFeedView ? (
                <CancelPresentationIcon fontSize="large" />
              ) : (
                <MailOutlineIcon fontSize="large" />
              )}
            </h3>
          </div>
        </section>
      </>
    )
  );
};

const mapStateToProps = (stateRedux) => {
  return {
    user: stateRedux.userReducer.user,
    commentFeed: stateRedux.commentReducer.commentFeed,
  };
};

export default connect(mapStateToProps)(CommentNotification);
