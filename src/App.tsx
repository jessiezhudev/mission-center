import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TaskList from './pages/TaskList'
import TaskDetail from './pages/TaskDetail'
import TaskCreate from './pages/TaskCreate'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/task/new" element={<TaskCreate />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

