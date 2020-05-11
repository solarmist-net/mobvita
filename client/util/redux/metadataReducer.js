import callBuilder from '../apiConnection'

export const getMetadata = (language) => {
  const route = `/metadata/${language}`
  const prefix = 'GET_METADATA'
  return callBuilder(route, prefix, 'get')
}

export const closeBanner = message => ({ type: 'CLOSE_BANNER', message })

export default (state = { pending: false, error: false }, action) => {
  switch (action.type) {
    case 'GET_METADATA_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_METADATA_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_METADATA_SUCCESS':
      return {
        ...state,
        concepts: action.response.concept_list,
        flashcardArticles: action.response.flashcard_articles,
        suggestedSites: action.response.suggested_sites,
        banners: action.response.banner_messages.map(b => ({ message: b, open: true })),
        pending: false,
        error: false,
      }
    case 'CLOSE_BANNER':
      return {
        ...state,
        banners: state.banners.map(b => (b.message === action.message ? { ...b, open: false } : b)),
      }
    default:
      return state
  }
}
