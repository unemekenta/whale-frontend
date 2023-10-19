export const statusFilter = (status: string): string => {
  return formatStatus(status)
}

export const statusColor = (status: string): string => {
  return getStatusColor(status)
}

export const priorityFilter = (priority: string): string => {
  return formatPriority(priority)
}

export const priorityColor = (priority: string): string => {
  return getPriorityColor(priority)
}

function formatStatus(inputStatus: string) {
  switch (inputStatus) {
    case "all":
      return "全て"
    case "not_started":
      return "未実施"
    case "in_progress":
      return "進行中"
    case "on_hold":
      return "保留中"
    case "completed":
      return "達成"
    default:
      return "未分類"
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "not_started":
      return "grey"
    case "in_progress":
      return "orange"
    case "on_hold":
      return "blue"
    case "completed":
      return "green"
    default:
      return "grey"
  }
}

function formatPriority(inputPriority: string) {
  switch (inputPriority) {
    case "emergency":
      return "緊急"
    case "high":
      return "高い"
    case "normal":
      return "通常"
    case "low":
      return "低い"
    default:
      return "低い"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "emergency":
      return "red"
    case "high":
      return "orange"
    case "normal":
      return "blue"
    case "low":
      return "green"
    default:
      return "green"
  }
}
