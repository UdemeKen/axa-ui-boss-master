export function getRowspanMethod(data, rowspanArray) {
  const rowspanNumObject = {}

  rowspanArray.map(item => {
    rowspanNumObject[item] = new Array(data.length).fill(1, 0, 1).fill(0, 1)
    rowspanNumObject[`${item}-index`] = 0
  })
  for (let i = 1; i < data.length; i++) {
    rowspanArray.map(key => {
      const index = rowspanNumObject[`${key}-index`]
      if (data[i][key] === data[i - 1][key]) {
        rowspanNumObject[key][index]++
      } else {
        rowspanNumObject[`${key}-index`] = i
        rowspanNumObject[key][i] = 1
      }
    })
  }
  const spanMethod = function({ row, column, rowIndex, columnIndex }) {
    if (rowspanArray.includes(column['property'])) {
      const rowspan = rowspanNumObject[column['property']][rowIndex]
      if (rowspan > 0) {
        return { rowspan: rowspan, colspan: 1 }
      }
      return { rowspan: 0, colspan: 0 }
    }
    return { rowspan: 1, colspan: 1 }
  }
  return spanMethod
}
