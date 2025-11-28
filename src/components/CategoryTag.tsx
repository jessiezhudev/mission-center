import { TaskCategory } from '../types/task'
import './CategoryTag.css'

interface CategoryTagProps {
  category: TaskCategory
}

export default function CategoryTag({ category }: CategoryTagProps) {
  return (
    <span className={`category-tag ${category}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  )
}