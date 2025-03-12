import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Paginator } from 'primereact/paginator'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { quizActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './QuizList.css'
import useQuery from '../../hooks/use-query'

const QuizList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useQuery()

  const { user } = useSelector(state => state.loginUser)
  const { publicQuizzes, count, fetching } = useSelector(state => state.publicQuizzes)

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
    dispatch(quizActions.getPublicQuizzes(page, pageSize, filterString))
  }, [dispatch, page, pageSize, filterString])

  useEffect(() => {
    const newSearch = `?page=${page}&pageSize=${pageSize}` +
     (selectedCategory ? `&category=${selectedCategory}` : '') +
      (selectedDifficulty ? `&difficulty=${selectedDifficulty}` : '')

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

  const categoryOptions = [...new Set(publicQuizzes.map(q => q.category))].map(cat => ({ label: cat, value: cat }))
  const difficultyOptions = [...new Set(publicQuizzes.map(q => q.difficulty))].map(diff => ({ label: diff, value: diff }))

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

  const startQuiz = quizId => {
    if (user) {
      navigate(`/quizzes/${quizId}`)
    } else {
      navigate('/guest-register', { state: { redirectTo: `/quizzes/${quizId}` } })
    }
  }

  const actionBodyTemplate = rowData => (
    <Button
      label={assets.BALL_KNOWLEDGE.QUIZ_LIST.BUTTON_START}
      icon='pi pi-play'
      className='p-button-success'
      onClick={() => startQuiz(rowData._id)}
    />
  )

  return (
    <div className='quiz-list-container'>
      <Button
        label='Quiz Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/play')}
      />
      <h1 className='quiz-list-title'>{assets.BALL_KNOWLEDGE.QUIZ_LIST.TITLE}</h1>

      {fetching
        ? (
          <p>{assets.BALL_KNOWLEDGE.QUIZ_LIST.LOADING}</p>
          )
        : (
          <>
            <DataTable
              value={publicQuizzes}
              paginator={false}
              className='quiz-datatable'
              responsiveLayout='scroll'
              filterDisplay='row'
            >
              <Column field='title' header='Title' sortable filter filterPlaceholder='Search Title' filterElement={titleFilterTemplate} showFilterMenu={false} />
              <Column field='category' header='Category' sortable filter filterElement={categoryFilterTemplate} showFilterMenu={false} />
              <Column field='difficulty' header='Difficulty' sortable filter filterElement={difficultyFilterTemplate} showFilterMenu={false} />
              <Column field='questions.length' header='Questions' sortable />
              <Column body={actionBodyTemplate} header='Action' />
            </DataTable>

            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={count}
              onPageChange={onPageChange}
            />
          </>
          )}
    </div>
  )
}

export default QuizList
