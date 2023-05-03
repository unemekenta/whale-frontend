export const statusFilter = (statusNum: number): string => {
  return formatStatus(statusNum)
}

function formatStatus(inputStatusNum: number) {
  switch (inputStatusNum) {
    case 1:
      return '未実施'
    case 2:
      return '進行中'
    case 3:
      return '確認待ち'
    case 4:
      return '完了'
    default:
      return '未分類'
  }
}
