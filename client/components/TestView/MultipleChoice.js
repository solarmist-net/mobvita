import React from 'react'
import { Button } from 'react-bootstrap'
import { sanitizeHtml } from 'Utilities/common'
import { FormattedMessage, useIntl } from 'react-intl'


const MultipleChoice = ({ exercise, onAnswer }) => {
  const intl = useIntl()
  const { choices, question, prephrase } = exercise

  return (
    <>
      <div className="test-question">
        <FormattedMessage id={prephrase} />
      </div>
      { question && (
        <div className="test-question" dangerouslySetInnerHTML={sanitizeHtml(question)} />
      )}
      {choices.map(choice => (
        <div key={choice}>
          <Button
            className="test-choice-button"
            onClick={() => onAnswer(choice)}
          >
            {intl.formatMessage({ id: choice, defaultMessage: choice })}
          </Button>
        </div>
      ))}
    </>
  )
}

export default MultipleChoice
