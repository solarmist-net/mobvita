import React from 'react'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import FlashcardDelete from './FlashcardDelete'

const FlashcardSide = ({
  flipCard,
  cardIndex,
  stage,
  children,
  id,
  handleEdit,
}) => {
  const backgroundColor = [
    'rgb(255, 99, 71)',
    'rgb(255, 165, 0)',
    'rgb(255, 215, 0)',
    'yellowgreen',
    'limegreen',
  ]

  return (
    <div className="flashcard" style={{ backgroundColor: backgroundColor[stage] }}>
      <div
        data-cy="flashcard-content"
        className="flashcard-content"
      >
        <div className="flashcard-header">
          <div>
            <button
              className="flashcard-blended-input"
              type="button"
              onClick={handleEdit}
            >
              <Icon name="edit" style={{ color: 'white' }} />
            </button>
            {cardIndex}
          </div>
          <FlashcardDelete id={id} />
        </div>
        {children}
      </div>
      <div className="flashcard-footer">
        <button
          className="flashcard-blended-input auto-left"
          type="button"
          onClick={() => flipCard()}
        >
          <FormattedMessage id="Flip" />
          {'  '}
          <Icon name="arrow right" />
        </button>
      </div>

    </div>
  )
}

export default FlashcardSide
