export const statusFilter = (statusNum: number): string => {
  return formatStatus(statusNum)
}

export const statusColor = (statusNum: number): string => {
  return getStatusColor(statusNum)
}

function formatStatus(inputStatusNum: number) {
  switch (inputStatusNum) {
    case 1:
      return "これから"
    case 2:
      return "頑張り中"
    case 3:
      return "保留中"
    case 4:
      return "達成"
    default:
      return "未分類"
  }
}

function getStatusColor(status: number): string {
  switch (status) {
    case 1:
      return "grey"
    case 2:
      return "orange"
    case 3:
      return "blue"
    case 4:
      return "green"
    default:
      return "grey"
  }
}
