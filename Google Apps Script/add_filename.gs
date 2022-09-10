function add_filename() {
  console.log('hi')
  let ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName('フォームの回答 1')
  let sheet_last_row = sheet.getLastRow()
  // let sheet_last_col = sheet.getLastColumn()
  console.log(`sheet_last_row: ${sheet_last_row}`)
  // console.log(`sheet_last_col: ${sheet_last_col}`)

  // c rowの最後までセルの値を取得，分割
  for(let w=2;w<=sheet_last_row;w++){
    console.log(w)
    let cell = sheet.getRange('C'+w)
    let urls = cell.getValue()
    let url_list = urls.split(',')
    console.log(`url_list_${w}:$ ${url_list}`)

    // 一つのセルの複数urlから複数ファイルの名前を取得
    var filename_str=''
    for(let v=0;v<url_list.length;v++){
      console.log(v)
      console.log(`url: ${url_list[v]}`)
      var url_id = url_list[v].split('id=')[1]
      var file = DriveApp.getFileById(url_id)
      var filename = file.getName()
      console.log(`filename: ${filename}`)
      filename_str+=filename+','
    }
    // 最後の,を削除
    filename_str=filename_str.slice(0,-1)
    console.log(`filename_str: ${filename_str}`)
    // 書き込み
    sheet.getRange('d'+w).setValue(filename_str)
  }

  // let cell = sheet.getRange('C2')
  // console.log(cell[0])
  // var urls = cell.getValue()
  // let url_list = urls.split(',')
  // console.log(urls)
  // console.log(url_list)
  // console.log(url_list.length)
  // console.log(url_list[0])

  // let url_id = url_list[0].split('id=')[1]

  // console.log(url_id)
  // console.log(url_id[1])

  // let file = DriveApp.getFileById(url_id)
  // let filename = file.getName()
  // console.log(filename)

  // let filename = ss.getName()
  // console.log(filename)
}
