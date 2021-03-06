import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getGroups, removeFromGroup, getGroupToken } from 'Utilities/redux/groupsReducer'
import { Dropdown, ListGroup, Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { getSummary } from 'Utilities/redux/groupSummaryReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { learningLanguageSelector } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { updateGroupSelect } from 'Utilities/redux/userReducer'
import Spinner from 'Components/Spinner'
import AddGroup from './AddGroup'
import AddToGroup from './AddToGroup'
import JoinGroup from './JoinGroup'
import CollapsingList from './CollapsingList'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import Summary from './Summary'
import StudentProgress from './StudentProgress'

const GroupView = () => {
  const intl = useIntl()
  const [addToGroupOpen, setAddToGroupOpen] = useState(false)
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [joinGroupOpen, setJoinGroupOpen] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [summary, setSummary] = useState(false)
  const [progress, setProgress] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const userOid = useSelector(({ user }) => user.data.user.oid)
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const history = useHistory()
  const bigWindow = useWindowDimensions().width >= 630

  const { groups, created, pending, token } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(group => group.group_id === currentGroupId)

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || groups.length === 0) return
    if (currentGroupId && groups.some(group => group.group_id === currentGroupId)) return
    dispatch(updateGroupSelect(groups[0].group_id))
  }, [groups])

  useEffect(() => {
    if (currentGroup && currentGroup.is_teaching) {
      dispatch(getGroupToken(currentGroupId))
    }
  }, [currentGroup])

  useEffect(() => {
    if (!created) return
    dispatch(updateGroupSelect(created.group_id))
  }, [created])

  const compare = (a, b) => {
    if (a.userName.toLowerCase() < b.userName.toLowerCase()) return -1
    if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1
    return 0
  }

  if (currentGroup) {
    currentGroup.teachers.sort(compare)
    currentGroup.students.sort(compare)
  }

  const removeUser = (userId) => {
    dispatch(removeFromGroup(currentGroupId, userId))
  }

  const handleSettingsClick = () => {
    history.push(`/groups/${currentGroupId}/concepts`)
  }

  const handleSummary = () => {
    setProgress(false)
    setSummary(true)
  }

  const handleProgress = () => {
    setSummary(false)
    setProgress(true)
  }

  const handleShowToken = () => {
    setShowToken(!showToken)
  }

  const handleTokenCopy = () => {
    dispatch(setNotification('token-copied', 'info'))
  }

  const handleGroupChange = (key) => {
    dispatch(updateGroupSelect(key))
  }

  if (pending || (!currentGroup && groups && groups.length > 0)) return <Spinner />

  if (!currentGroup) {
    return (
      <div className="group-container nogroups">
        <h2 id="title"> <FormattedMessage id="Groups" /></h2>
        <Button id="join-group-button" variant="info" onClick={() => setJoinGroupOpen(true)}>
          <FormattedMessage id="join-group" />
        </Button>
        <span className="additional-info">
          <FormattedMessage id="join-group-message" />
        </span>

        <br />
        <Button
          data-cy="create-group-modal"
          variant="primary"
          onClick={() => setAddGroupOpen(true)}
        >
          <FormattedMessage id="create-new-group" />
        </Button>
        <span className="additional-info">
          <FormattedMessage id="create-group-message" />
        </span>

        <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
        <JoinGroup isOpen={joinGroupOpen} setOpen={setJoinGroupOpen} />
      </div>
    )
  }

  const currentUserIsTeacher = currentGroup.teachers.find(teacher => teacher._id === userOid)

  return (
    <div className="group-container">
      <div className="group-controls padding-bottom-1">

        <Button variant="info" onClick={() => setJoinGroupOpen(true)}>
          <FormattedMessage id="join-group" />
        </Button>
        {bigWindow
          && (
            <Button
              data-cy="create-group-modal"
              variant="info"
              onClick={() => setAddGroupOpen(true)}
            >
              <FormattedMessage id="create-new-group" />
            </Button>
          )
        }
      </div>
      <hr />
      <Dropdown
        style={{ marginBottom: '0.5em' }}
        className="auto-right"
        onSelect={key => handleGroupChange(key)}
      >
        <Dropdown.Toggle variant="primary" id="dropdown-basic" data-cy="select-group">
          {currentGroup.groupName}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {groups.map(group => (
            <Dropdown.Item eventKey={group.group_id} key={group.group_id}>{group.groupName}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <CollapsingList header={intl.formatMessage({ id: 'Teachers' })}>
        <ListGroup>
          {currentGroup.teachers.map(teacher => (
            <ListGroup.Item key={teacher.userName}>{teacher.userName}</ListGroup.Item>
          ))}
        </ListGroup>
      </CollapsingList>
      {currentGroup.is_teaching
        && (
          <CollapsingList header={intl.formatMessage({ id: 'Students' })}>
            <ListGroup style={{
              maxHeight: '40vh',
              overflowY: 'auto',
            }}
            >
              {currentGroup.students.length === 0 ? <ListGroup.Item /> : currentGroup.students.map(student => (
                <ListGroup.Item
                  style={{
                    backgroundColor: student === currentStudent ? 'gray' : 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  key={student.userName}
                  onClick={() => setCurrentStudent(student)}
                >
                  {student.userName}
                  {currentUserIsTeacher && (
                    <Icon
                      data-cy={`remove-from-group-${student.userName}`}
                      style={{ cursor: 'pointer' }}
                      name="close"
                      color="red"
                      onClick={() => removeUser(student._id)}
                    />
                  )
                  }
                </ListGroup.Item>
              ))}
            </ListGroup>
          </CollapsingList>
        )
      }
      {currentGroup.is_teaching && !bigWindow
        && (
          <>
            <div className="group-controls padding-top-1">
              <Button className="auto-right" onClick={handleShowToken} block>
                <FormattedMessage id="show-group-token" />
              </Button>
            </div>
            {showToken && (
              <div className="border rounded" style={{ display: 'flex', marginTop: '0.2em', minHeight: '3em', flexDirection: 'row' }}>
                <div
                  style={{ padding: '0.5em', margin: 'auto', wordBreak: 'break-all' }}
                >
                  {token}
                </div>
                <CopyToClipboard text={token}>
                  <Button type="button" onClick={handleTokenCopy}>
                    <Icon name="copy" size="large" />
                  </Button>
                </CopyToClipboard>
              </div>
            )}
          </>
        )}
      {currentGroup.is_teaching && bigWindow
        && (
          <>
            <div className="group-controls padding-top-1">
              <Button onClick={handleSummary}>
                <FormattedMessage id="summary" />
              </Button>
              <Button onClick={handleProgress}>
                <FormattedMessage id="Progress" />
              </Button>
              <Button onClick={handleSettingsClick} variant="secondary" className="auto-right">
                <FormattedMessage id="learning-settings" />
              </Button>
              <Button
                data-cy="add-to-group-modal"
                onClick={() => setAddToGroupOpen(true)}
              >
                <FormattedMessage id="add-people-to-group" />
              </Button>
              <Button onClick={handleShowToken}>
                <FormattedMessage id="show-group-token" />
              </Button>
              <DeleteConfirmationModal
                groupId={currentGroupId}
                trigger={(
                  <Button
                    data-cy="delete-group"
                    variant="danger"
                  >
                    <Icon name="trash alternate outline" /> {intl.formatMessage({ id: 'delete-group' })}
                  </Button>

                )}
              />
            </div>
            {showToken && (
              <div className="border rounded" style={{ display: 'flex', marginTop: '0.2em', minHeight: '3em' }}>
                <span style={{ margin: 'auto' }}>{token}</span>
                <CopyToClipboard text={token}>
                  <Button type="button" onClick={handleTokenCopy}>
                    <Icon name="copy" size="large" />
                  </Button>
                </CopyToClipboard>
              </div>
            )}
          </>
        )
      }

      {summary && currentGroup.is_teaching && (
        <>
          <hr />
          <Summary
            groupName={currentGroup.groupName}
            isTeaching={currentGroup.is_teaching}
            learningLanguage={learningLanguage}
            getSummary={(start, end) => dispatch(getSummary(currentGroupId, start, end))}
          />
        </>
      )}
      {progress && currentGroup.is_teaching && (
        <StudentProgress
          student={currentStudent}
          groupId={currentGroupId}
        />
      )}


      <AddToGroup groupId={currentGroupId} isOpen={addToGroupOpen} setOpen={setAddToGroupOpen} />
      <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
      <JoinGroup isOpen={joinGroupOpen} setOpen={setJoinGroupOpen} />
    </div>
  )
}

export default GroupView
