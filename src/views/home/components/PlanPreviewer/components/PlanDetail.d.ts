interface TableCell {
  key: number
  text: string
  className: string
}

type TheadCell = TableCell

interface TbodyCell extends TableCell {
  week: number
  desc?: string
  bgColor?: string
  textColor?: string
}
