import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TaskList from './pages/TaskList'
import TaskDetail from './pages/TaskDetail'
import TaskCreate from './pages/TaskCreate'
import TaskEdit from './pages/TaskEdit'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/task/new" element={<TaskCreate />} />
          <Route path="/task/:id/edit" element={<TaskEdit />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

