export interface User {
  id: number
  name: string
  nickname: string
  image: {
    url: string
  }
  introduction: string
}

export interface ImageUrl {
  url: string
}

export interface Image {
  id: number
  image: ImageUrl
  caption: string
}

export interface DiariesImageRelation {
  id: number
  diary_id: number
  image_id: number
}

export interface Diary {
  id: number
  title: string
  content: string
  is_public: boolean
  date: string
  images: Image[]
  user: User
  diary_comments: DiaryComment[]
}

export interface InformationContents {
  id: number
  content: string
  link: string
  display_link: boolean
  start_at: string
  end_at: string
}

export interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
  deadline: string
  updated_at: string
  comments: TaskComment[]
  tags: Tag[]
}

export interface Tag {
  id: number
  name: string
}

export interface Tagging {
  tag_id: number
}

export interface DiaryComment {
  id: number
  user_id: number
  diary_id: number
  content: string
  updated_at: string
  user: User
  is_own_comment: boolean
}

export interface TaskComment {
  id: number
  content: string
  updated_at: string
  user: User
  is_own_comment: boolean
}

export interface PagiNation {
  current_page: number
  next_page: number | null
  prev_page: number | null
  total_pages: number
  total_count: number
  limit_value: number
}
