import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { getPersonalSummary } from 'Utilities/redux/groupSummaryReducer'
import { learningLanguageSelector, images, capitalize } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import 'react-datepicker/dist/react-datepicker.css'

const ProgressStats = ({ startDate, endDate }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const { summary, pending } = useSelector(({ summary }) => summary)

  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    dispatch(getPersonalSummary(learningLanguage, startDate, endDate))
  }, [startDate, endDate, learningLanguage])

  if (!summary || pending) return <Spinner />

  const getLearningLanguageFlag = () => {
    if (learningLanguage) {
      return images[`flag${capitalize(learningLanguage.split('-').join(''))}`]
    }
    return null
  }

  return (
    <div className="center gap-2 padding-top-3 padding-bottom-3">
      <img
        src={getLearningLanguageFlag()}
        alt="learning language flag"
        height="72px"
        style={{ border: '1px solid gray' }}
      />
      <div className="stat">
        <span>{intl.formatMessage({ id: 'completed-exercises' })}: </span>
        <span>{summary[0] && summary[0].number_of_exercises}</span>
      </div>
      <div className="stat">
        <span>{intl.formatMessage({ id: 'completed-snippets' })}: </span>
        <span>{summary[0] && summary[0].number_of_snippets}</span>
      </div>
    </div>
  )
}

export default ProgressStats
