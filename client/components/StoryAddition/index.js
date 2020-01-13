import React, { useState, useEffect } from 'react'
import { Modal, Button, Input } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import isUrl from 'is-url'
import { capitalize, getLearningLanguage } from 'Utilities/common'

import { postStory } from 'Utilities/redux/storiesReducer'
import { FormattedMessage, useIntl } from 'react-intl'

const StoryAddition = () => {
  const [url, setURL] = useState('')
  const [language, setLanguage] = useState('')
  const [modalOpen, setModal] = useState(false)
  const intl = useIntl()
  const dispatch = useDispatch()

  useEffect(() => {
    const currentLanguage = getLearningLanguage()
    setLanguage(capitalize(currentLanguage))
  }, [])

  const handleSave = () => {
    const newStory = {
      url,
      language,
    }
    setModal(false)
    dispatch(postStory(newStory))
  }

  return (
    <>
      <Button style={{ marginTop: '10px' }} color="black" fluid onClick={() => setModal(true)}>
        <FormattedMessage id="ADD_NEW_STORY" />
      </Button>
      <Modal open={modalOpen} onClose={() => setModal(false)} style={{ maxHeight: '20em' }}>
        <Modal.Header>
          <FormattedMessage id="ADD_NEW_STORY" />
        </Modal.Header>
        <Input label={intl.formatMessage({ id: 'NEW_STORY_URL' })} fluid onChange={e => setURL(e.target.value)} style={{ padding: '10px' }} />
        <Modal.Actions>
          <Button onClick={() => setModal(false)}>
            <FormattedMessage id="CANCEL" />
          </Button>
          <Button color="teal" disabled={!isUrl(url)} onClick={handleSave}>
            <FormattedMessage id="CONFIRM" />
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default StoryAddition
