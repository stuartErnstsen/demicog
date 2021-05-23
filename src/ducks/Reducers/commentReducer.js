
const initialState = {
    commentFeed: []
}

const SET_COMMENT_FEED = 'SET_COMMENT_FEED';

export function setCommentFeed(list) {
    return {
        type: SET_COMMENT_FEED,
        payload: list
    }
}


export default function commentReducer(state = initialState, action) {
    const { type, payload } = action;
    console.log(payload)
    switch (type) {
        case SET_COMMENT_FEED:
            return { ...state, commentFeed: payload }
        default:
            return state;
    }
}