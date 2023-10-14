export const statusFilter = (status: string): string => {
  return formatStatus(status)
}

export const statusColor = (status: string): string => {
  return getStatusColor(status)
}

function formatStatus(inputStatus: string) {
  switch (inputStatus) {
    case "all":
      return "全て"
    case "not_started":
      return "これから"
    case "in_progress":
      return "頑張り中"
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
