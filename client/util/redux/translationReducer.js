import { translatableLanguages } from 'Utilities/common'
import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getTranslationAction = (language, wordLemmas, locale, storyId, wordId) => {
  const route = `/translation/${locale}/${language || translatableLanguages[locale][0]}`
  const prefix = 'GET_TRANSLATION'
  const payload = { wordLemmas, storyId, wordId }
  return callBuilder(route, prefix, 'post', payload)
}

export const clearTranslationAction = () => ({ type: 'CLEAR_TRANSLATION' })


export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_TRANSLATION_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_TRANSLATION_SUCCESS':
      return {
        ...state,
        data: action.response['responses-json'],
        pending: false,
        error: false,
      }
    case 'GET_TRANSLATION_FAILURE':
      return {
        ...state,
        focused: action.response,
        pending: false,
        error: true,
      }
    case 'CLEAR_TRANSLATION': {
      return {
        ...state,
        data: [],
      }
    }
    default:
      return state
  }
}
