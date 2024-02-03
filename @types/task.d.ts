import { Tagging } from "@/@types/common"

export interface TaskListTable {
  id: number
  title: string
  status: number
  priority: number
  deadline: string
}

export interface TaskForm {
  id: number
  title: string
  description: string
  priority: string
  status: string
  deadline: string
  taggings: Tagging[]
}
