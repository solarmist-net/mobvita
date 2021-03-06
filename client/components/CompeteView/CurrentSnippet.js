import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { getCurrentSnippet, postAnswers, setTotalNumberAction } from 'Utilities/redux/snippetsReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import ExerciseCloze from 'Components/CompeteView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/CompeteView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/CompeteView/ExerciseHearing'
import OpponentProgress from 'Components/CompeteView/OpponentProgress'
import { Button } from 'react-bootstrap'

const CurrentPractice = ({ storyId }) => {
  const [answers, setAnswers] = useState({})
  const [options, setOptions] = useState({})
  const [audio, setAudio] = useState([])
  const [touched, setTouched] = useState(0)
  const [attempt, setAttempts] = useState(0)

  const dispatch = useDispatch()

  const { snippets } = useSelector(({ snippets, locale }) => ({ snippets, locale }))
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const learningLanguage = useSelector(learningLanguageSelector)


  const setInitialAnswers = () => {
    if (snippets.focused) {
      const filteredSnippet = snippets.focused.practice_snippet.filter(word => word.id)
      const initialAnswers = filteredSnippet.reduce((answerObject, currentWord) => {
        const { surface, id, ID, base, bases, listen, choices } = currentWord
        if (answers[ID]) return { ...answerObject, [ID]: answers[ID] }
        const newAnswerObject = {
          ...answerObject,
          [ID]: {
            correct: surface,
            users_answer: (listen || choices) ? '' : (base || bases),
            id,
          },
        }
        return newAnswerObject
      }, {})
      if (Object.keys(initialAnswers).length > 0) setAnswers(initialAnswers)
    }
  }

  useEffect(setInitialAnswers, [snippets.focused])

  const getExerciseCount = () => {
    let count = 0
    snippets.focused.practice_snippet.forEach((word) => {
      if (word.id) {
        count++
      }
    })

    return count
  }

  const continueToNextSnippet = () => {
    setAnswers({})
    setOptions({})
    setTouched(0)
    setAttempts(0)
    dispatch(getCurrentSnippet(storyId))
  }

  const checkAnswers = async () => {
    const { starttime, snippetid } = snippets.focused

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: [snippetid[0]],
      touched: getExerciseCount(),
      untouched: 0,
      attempt,
      options,
      audio,
      answers,
    }

    setAttempts(attempt + 1)
    await dispatch(postAnswers(storyId, answersObj, true))
    continueToNextSnippet()
  }

  const textToSpeech = (surfaceWord, wordLemmas) => {
    // const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
    if (wordLemmas) {
      dispatch(getTranslationAction(capitalize(learningLanguage), wordLemmas, capitalize(dictionaryLanguage)))
    }
  }

  const handleAnswerChange = (e, word) => {
    const { surface, id, ID } = word

    if (!answers[ID]) {
      setTouched(touched + 1)
    }

    const newAnswers = {
      ...answers,
      [ID]: {
        correct: surface,
        users_answer: e.target.value,
        id,
      },
    }
    setAnswers(newAnswers)
  }

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface } = word
    const { value } = data

    if (!answers[ID]) {
      setTouched(touched + 1)
    }

    const newAnswers = {
      ...answers,
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
      },
    }
    setAnswers(newAnswers)
  }


  const wordInput = (word) => {
    if (!word.id && !word.lemmas) return word.surface
    if (!word.id) {
      return (
        <span
          role="button"
          tabIndex={-1}
          className={!word.base && answers[word.ID] ? 'word-interactive--exercise' : 'word-interactive '}
          key={word.ID}
          onKeyDown={() => textToSpeech(word.surface, word.lemmas)}
          onClick={() => textToSpeech(word.surface, word.lemmas)}
        >
          {word.surface}
        </span>
      )
    }
    const usersAnswer = answers[word.ID] ? answers[word.ID].users_answer : ''

    if (word.listen) {
      if (!audio.includes(word.ID.toString())) {
        audio.push(word.ID.toString())
      }
      return (
        <ExerciseHearing
          tabIndex={word.ID}
          handleChange={handleAnswerChange}
          handleClick={textToSpeech}
          value={usersAnswer}
          key={word.ID}
          word={word}
        />
      )
    }
    if (word.choices) {
      return (
        <ExerciseMultipleChoice
          tabIndex={word.ID}
          handleChange={handleMultiselectChange}
          key={word.ID}
          value={usersAnswer}
          word={word}
        />
      )
    }
    return (
      <ExerciseCloze
        tabIndex={word.ID}
        handleChange={handleAnswerChange}
        handleClick={textToSpeech}
        key={word.ID}
        value={usersAnswer}
        word={word}
      />
    )
  }

  if (!snippets.focused || snippets.pending) return null

  const { practice_snippet: practice } = snippets.focused
  return (
    <>

      <Segment style={{ marginBottom: '5px', wordSpacing: '1px', lineHeight: '2em' }}>
        {practice.map(exercise => wordInput(exercise))}
      </Segment>
      <OpponentProgress />

      <Button variant="primary" block onClick={checkAnswers}>Continue to next snippet </Button>
    </>
  )
}


export default CurrentPractice
