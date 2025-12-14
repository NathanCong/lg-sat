interface ColumnItem {
  key: string
  dataIndex?: string | string[]
  title: string
  fixed?: 'left' | 'right' | boolean
  width?: number
}

interface Pagination {
  pageNum: number
  pageSize: number
  total: number
}
