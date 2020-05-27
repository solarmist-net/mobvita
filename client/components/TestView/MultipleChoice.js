import React from 'react'
import { Button } from 'react-bootstrap'
import { sanitizeHtml } from 'Utilities/common'


const MultipleChoice = ({ exercise, onAnswer }) => {
  const { choices, question, prephrase } = exercise
  return (
    <>
      <div className="test-question" dangerouslySetInnerHTML={sanitizeHtml(prephrase)} />
      <div className="test-question" dangerouslySetInnerHTML={sanitizeHtml(question)} />
      {choices.map(choice => (
        <div key={choice}>
          <Button
            className="test-choice-button"
            onClick={() => onAnswer(choice)}
          >
            {choice}
          </Button>
        </div>
      ))}
    </>
  )
}

export default MultipleChoice
