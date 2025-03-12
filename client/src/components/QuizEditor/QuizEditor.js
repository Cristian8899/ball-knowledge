import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { Checkbox } from 'primereact/checkbox'
import { quizActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './QuizEditor.css'

const QuizEditor = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useRef(null)

  const { user } = useSelector(state => state.loginUser)
  const { createdQuiz: quiz, fetching, error } = useSelector(state => state.createdQuiz)

  const [editedQuiz, setEditedQuiz] = useState({
    title: '',
    category: '',
    difficulty: assets.BALL_KNOWLEDGE.QUIZ_EDITOR.DIFFICULTY_OPTIONS.MEDIUM,
    questions: [],
    isPublic: false
  })

  const difficultyOptions = [
    { label: assets.BALL_KNOWLEDGE.QUIZ_EDITOR.DIFFICULTY_OPTIONS.EASY, value: 'Easy' },
    { label: assets.BALL_KNOWLEDGE.QUIZ_EDITOR.DIFFICULTY_OPTIONS.MEDIUM, value: 'Medium' },
    { label: assets.BALL_KNOWLEDGE.QUIZ_EDITOR.DIFFICULTY_OPTIONS.HARD, value: 'Hard' }
  ]

  useEffect(() => {
    if (user?._id) {
      dispatch(quizActions.getCreatedQuiz(user._id, quizId))
    }
  }, [dispatch, user, quizId])

  useEffect(() => {
    if (quiz && quiz.questions) {
      setEditedQuiz({
        title: quiz.title || '',
        category: quiz.category || '',
        difficulty: quiz.difficulty || assets.BALL_KNOWLEDGE.QUIZ_EDITOR.DIFFICULTY_OPTIONS.MEDIUM,
        questions: quiz.questions.map(q => ({
          questionText: q.questionText,
          options: [...q.options],
          correctAnswer: q.correctAnswer ?? 0
        })),
        isPublic: quiz.isPublic || false
      })
    }
  }, [quiz])

  const handleQuizChange = (e, field) => {
    setEditedQuiz({ ...editedQuiz, [field]: e.target.value })
  }

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = [...editedQuiz.questions]
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions })
  }

  const handleCorrectAnswerChange = (e, questionIndex) => {
    const updatedQuestions = [...editedQuiz.questions]
    updatedQuestions[questionIndex].correctAnswer = Number(e.target.value)
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions })
  }

  const toggleIsPublic = () => {
    setEditedQuiz(prevQuiz => ({ ...prevQuiz, isPublic: !prevQuiz.isPublic }))
  }

  const addQuestion = () => {
    setEditedQuiz({
      ...editedQuiz,
      questions: [
        ...editedQuiz.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    })
  }

  const removeQuestion = (index) => {
    setEditedQuiz({
      ...editedQuiz,
      questions: editedQuiz.questions.filter((_, i) => i !== index)
    })
  }

  const handleUpdate = () => {
    if (!editedQuiz.title.trim() || !editedQuiz.category.trim() || editedQuiz.questions.length === 0) {
      toast.current.show({
        severity: 'error',
        summary: assets.BALL_KNOWLEDGE.QUIZ_EDITOR.TOAST.QUIZ_INCOMPLETE_TITLE,
        detail: assets.BALL_KNOWLEDGE.QUIZ_EDITOR.TOAST.QUIZ_INCOMPLETE_MESSAGE,
        life: 3000
      })
      return
    }

    dispatch(quizActions.updateQuiz(quizId, editedQuiz, user._id))

    navigate('/created-quizzes')
  }

  if (fetching) return <div className='quiz-editor-container'><h2>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.LOADING}</h2></div>
  if (error) return <div className='quiz-editor-container'><h2>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.ERROR}</h2></div>

  return (
    <div className='quiz-editor-container'>
      <Toast ref={toast} />
      <Button
        label='Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/')}
      />
      <h1 className='quiz-editor-title'>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.TITLE}</h1>

      <Card className='quiz-form-card'>
        <label>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.FORM.LABEL_TITLE}</label>
        <InputText value={editedQuiz.title} onChange={(e) => handleQuizChange(e, 'title')} className='quiz-input' />

        <label>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.FORM.LABEL_CATEGORY}</label>
        <InputText value={editedQuiz.category} onChange={(e) => handleQuizChange(e, 'category')} className='quiz-input' />

        <label>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.FORM.LABEL_DIFFICULTY}</label>
        <Dropdown value={editedQuiz.difficulty} options={difficultyOptions} onChange={(e) => handleQuizChange(e, 'difficulty')} className='quiz-dropdown' />

        <div className='public-checkbox'>
          <Checkbox inputId='isPublic' checked={editedQuiz.isPublic} onChange={toggleIsPublic} />
          <label htmlFor='isPublic' style={{ marginLeft: '10px' }}>
            {editedQuiz.isPublic ? 'Public' : 'Private'}
          </label>
        </div>

        <div className='question-section'>
          <h3>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.QUESTIONS.SECTION_TITLE}</h3>
          {editedQuiz.questions.map((q, questionIndex) => (
            <div key={questionIndex} className='question-item'>
              <InputText
                placeholder='Question Text'
                value={q.questionText}
                onChange={(e) => {
                  const updatedQuestions = [...editedQuiz.questions]
                  updatedQuestions[questionIndex].questionText = e.target.value
                  setEditedQuiz({ ...editedQuiz, questions: updatedQuestions })
                }}
                className='quiz-input'
              />

              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className='option-group'>
                  <InputText
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e, questionIndex, optionIndex)}
                    className='quiz-input'
                  />
                </div>
              ))}

              <label>{assets.BALL_KNOWLEDGE.QUIZ_EDITOR.QUESTIONS.LABEL_CORRECT_ANSWER}</label>
              <Dropdown
                value={q.correctAnswer}
                options={q.options.map((opt, i) => ({ label: opt, value: i }))}
                onChange={(e) => handleCorrectAnswerChange(e, questionIndex)}
                className='quiz-dropdown'
              />

              <Button icon='pi pi-trash' className='p-button-danger' onClick={() => removeQuestion(questionIndex)} />
            </div>
          ))}
        </div>

        <Button label={assets.BALL_KNOWLEDGE.QUIZ_EDITOR.QUESTIONS.BUTTON_ADD_QUESTION} icon='pi pi-plus' className='p-button-primary add-question-btn' onClick={addQuestion} />

        <Button label={assets.BALL_KNOWLEDGE.QUIZ_EDITOR.BUTTON_UPDATE} icon='pi pi-check' className='p-button-success update-quiz-btn' onClick={handleUpdate} />
      </Card>
    </div>
  )
}

export default QuizEditor
