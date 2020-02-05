import React from 'react'
import { Tab } from 'semantic-ui-react'
import StoryList from 'Components/StoryListView/StoryList'
import HomeView from 'Components/LandingPage/HomeView'
import FlashCards from 'Components/Flashcards'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

const Tabs = ({ location }) => {
  const intl = useIntl()

  const panes = [
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Home' }),
        to: '/home',
        key: 'home',
      },
      render: () => <Tab.Pane><HomeView /></Tab.Pane>,
    },
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Library' }),
        to: '/library',
        key: 'library',
      },
      render: () => <Tab.Pane><StoryList /></Tab.Pane>,
    },
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Flashcards' }),
        to: '/flashcards',
        key: 'flashcards',
      },
      render: () => <Tab.Pane><FlashCards /></Tab.Pane>,
    },
  ]

  let index
  switch (location.pathname) {
    case '/library':
      index = 1
      break
    case '/flashcards':
      index = 2
      break
    default:
      index = 0
  }

  return (
    <Tab
      panes={panes}
      activeIndex={index}
    />
  )
}

export default Tabs
