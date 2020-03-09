import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getStoryAction = (storyId) => {
  const route = `/stories/${storyId}`
  const prefix = 'GET_STORY'
  return callBuilder(route, prefix)
}

export const getAllStories = (language, query) => {
  const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
  const route = `/stories?language=${language}&${queryString}`
  const prefix = 'GET_ALL_STORIES'
  return callBuilder(route, prefix)
}

export const getStories = (language, query = { page: 0, page_size: 10 }) => {
  const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
  const route = `/stories?language=${language}&${queryString}`
  const prefix = 'GET_STORIES'
  return callBuilder(route, prefix)
}


// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: [], pending: false, error: false }, action) => {
  switch (action.type) {
    case 'GET_STORIES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STORIES_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_ALL_STORIES_ATTEMPT':
      return {
        ...state,
        allPending: true,
      }
    case 'GET_ALL_STORIES_SUCCESS':
      return {
        ...state,
        allStories: action.response.stories,
        allPending: false,
      }
    case 'GET_STORIES_SUCCESS':
      return {
        ...state,
        data: action.response.stories,
        totalNum: action.response.total_num,
        pending: false,
        error: false,
      }
    case 'GET_STORY_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STORY_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_STORY_SUCCESS':
      return {
        ...state,
        focused: action.response,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
