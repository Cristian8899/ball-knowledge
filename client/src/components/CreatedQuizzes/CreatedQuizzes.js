import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Paginator } from 'primereact/paginator'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { quizActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './CreatedQuizzes.css'
import useQuery from '../../hooks/use-query'

const CreatedQuizzes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useQuery()
  const toast = useRef(null)

  const { createdQuizzes, count, fetching } = useSelector(state => state.createdQuizzes)
  const { user } = useSelector(state => state.loginUser)

  const pageQuery = query.get('page') ? Number(query.get('page')) : 1
  const pageSizeQuery = query.get('pageSize') ? Number(query.get('pageSize')) : 5
  const categoryQuery = query.get('category') || null
  const difficultyQuery = query.get('difficulty') || null

  const [page, setPage] = useState(pageQuery)
  const [pageSize, setPageSize] = useState(pageSizeQuery)
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery)
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficultyQuery)

  const filterString = [
    selectedCategory ? `category=${selectedCategory}` : '',
    selectedDifficulty ? `difficulty=${selectedDifficulty}` : ''
  ].filter(Boolean).join('&')

  useEffect(() => {
    if (user?._id) {
      dispatch(quizActions.getCreatedQuizzes(user._id, page, pageSize, filterString))
    }
  }, [dispatch, user, page, pageSize, filterString])

  useEffect(() => {
    const newSearch = `?page=${page}&pageSize=${pageSize}` +
     (selectedCategory ? `&category=${selectedCategory}` : '') + (selectedDifficulty ? `&difficulty=${selectedDifficulty}` : '')

    navigate(newSearch, { replace: true })
  }, [page, pageSize, selectedCategory, selectedDifficulty])

  const onPageChange = event => {
    setPage(event.page + 1)
    setPageSize(event.rows)
  }

  const onCategoryChange = e => {
    setSelectedCategory(e.value)
    setPage(1)
  }

  const onDifficultyChange = e => {
    setSelectedDifficulty(e.value)
    setPage(1)
  }

  const categoryOptions = [...new Set(createdQuizzes.map(q => q.category))].map(cat => ({ label: cat, value: cat }))
  const difficultyOptions = [...new Set(createdQuizzes.map(q => q.difficulty))].map(diff => ({ label: diff, value: diff }))

  const categoryFilterTemplate = options => (
    <Dropdown
      value={selectedCategory}
      options={categoryOptions}
      onChange={e => {
        onCategoryChange(e)
        options.filterApplyCallback(e.value)
      }}
      placeholder='Select Category'
      showClear
      className='p-column-filter'
    />
  )

  const difficultyFilterTemplate = options => (
    <Dropdown
      value={selectedDifficulty}
      options={difficultyOptions}
      onChange={e => {
        onDifficultyChange(e)
        options.filterApplyCallback(e.value)
      }}
      placeholder='Select Difficulty'
      showClear
      className='p-column-filter'
    />
  )

  const titleFilterTemplate = options => (
    <InputText
      value={options.value}
      onChange={e => options.filterApplyCallback(e.target.value)}
      placeholder='Search Title'
      className='p-column-filter'
    />
  )

  const deleteQuiz = quizId => {
    dispatch(quizActions.deleteCreatedQuiz(user._id, quizId, page, pageSize))
    toast.current.show({
      severity: 'warn',
      summary: assets.BALL_KNOWLEDGE.CREATED_QUIZZES.TOAST.QUIZ_DELETED_TITLE,
      detail: assets.BALL_KNOWLEDGE.CREATED_QUIZZES.TOAST.QUIZ_DELETED_MESSAGE,
      life: 3000
    })
  }

  const editQuiz = quizId => {
    navigate(`/created-quizzes/${quizId}`)
  }

  const actionBodyTemplate = rowData => (
    <div className='quiz-actions'>
      <Button
        label={assets.BALL_KNOWLEDGE.CREATED_QUIZZES.ACTIONS.EDIT}
        icon='pi pi-pencil'
        className='p-button-warning p-button-sm'
        onClick={() => editQuiz(rowData._id)}
      />
      <Button
        label={assets.BALL_KNOWLEDGE.CREATED_QUIZZES.ACTIONS.DELETE}
        icon='pi pi-trash'
        className='p-button-danger p-button-sm'
        onClick={() => deleteQuiz(rowData._id)}
      />
    </div>
  )

  return (
    <div className='created-quizzes-container'>
      <Toast ref={toast} />

      <Button
        label='Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/')}
      />
      <h1 className='created-quizzes-title'>{assets.BALL_KNOWLEDGE.CREATED_QUIZZES.TITLE}</h1>

      {fetching
        ? (
          <p>{assets.BALL_KNOWLEDGE.CREATED_QUIZZES.LOADING}</p>
          )
        : (
          <>
            <DataTable
              value={createdQuizzes}
              paginator={false}
              className='created-quizzes-table'
              responsiveLayout='scroll'
              filterDisplay='row'
            >
              <Column field='title' header='Title' sortable filter filterPlaceholder='Search Title' filterElement={titleFilterTemplate} showFilterMenu={false} />
              <Column field='category' header='Category' sortable filter filterElement={categoryFilterTemplate} showFilterMenu={false} />
              <Column field='difficulty' header='Difficulty' sortable filter filterElement={difficultyFilterTemplate} showFilterMenu={false} />
              <Column field='questions.length' header='Questions' sortable />
              <Column body={actionBodyTemplate} header='Actions' />
            </DataTable>

            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={count}
              onPageChange={onPageChange}
            />
          </>
          )}

      <Button
        label={assets.BALL_KNOWLEDGE.CREATED_QUIZZES.ACTIONS.CREATE_NEW}
        icon='pi pi-plus'
        className='p-button-primary create-quiz-btn'
        onClick={() => navigate('/quiz-creation')}
      />
    </div>
  )
}

export default CreatedQuizzes
