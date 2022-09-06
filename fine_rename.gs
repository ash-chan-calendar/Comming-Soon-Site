function rename() {
  console.log('hoi')
  let ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName('image_sum_by_user')
  // let sheet_last_row = sheet.getLastRow()
  // sheet_last_row = sheet_last_row-1 //合計を含まない
  // console.log(sheet_last_row)

  // B列の最終行を数える
  var lastRow_b = sheet.getRange('b1').getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow()
  lastRow_b = lastRow_b -1 //合計を含まない
  console.log(lastRow_b)

  // スプレッドシートを参照して，twitter_id,画像数を取得
  for (let v=3;v<=lastRow_b;v++){ //上限はシートの値の数
    // console.log(`v: ${v}`)
    // console.log(`rename_n: ${rename_n}`)
    let cell_account = sheet.getRange('A'+v)
    // let cell_image_len = sheet.getRange('B'+v)
    let cell_url = sheet.getRange('C'+v)
    let account_val = cell_account.getValue()
    // let image_val = cell_image_len.getValue()
    let url_val = cell_url.getValue()
    // console.log(`tw_id: ${account_val}, len_image: ${image_val}`)
    // console.log(`urls: ${url_val}`)

    let url_list = url_val.split(',')
    let url_list_len = url_list.length
    // console.log(`url_list.length: ${url_list_len}`)

    // url_listからurlを入れて，
    for (let w=0;w<url_list_len;w++){
      // console.log(`w: ${w}`)
      // console.log(`url_list[w]: ${url_list[w]}`)
      let rename_n = w+1
      // console.log(account_val +'-'+ rename_n)
      let url_split = url_list[w].split('id=')
      let file = DriveApp.getFileById(url_split[1])
      file.setName(account_val +'-'+ rename_n)

    }
  }

  // throw new Error('テストのエラーです！')

  // スプレッドシートを参照して，ドライブのurlを取得

  // ドライブの名前を取得
  // DriveApp.getFileById()
  // sample_url = "https://drive.google.com/drive/u/0/folders/1SVXLp8MrL034UD3ORA5A3JRG9NyfisHNlkeUeqTFS6a-RSHkqgCF2TGc_p_V1S2QQfiIn7HE"
  // sample_url = "https://drive.google.com/open?id=1HLJW3UnTgrk-a-a4bCO3nOxLQT65hiWP"
  // sample_url_split = sample_url.split('id=')
  // console.log(sample_url_split[1])
  // sample_file = DriveApp.getFileById(sample_url_split[1])
  // console.log(sample_file)
  // sample_file_name = sample_file.getName()
  // console.log(sample_file_name)

  // twitter_idにハイフンは使えないので連番をつなげるならハイフンが良い
  // sample_file.setName('new_q_kun-1')



  // スプレッドシートを参照するコード
  // let cell_account = sheet.getRange('A'+3)
  // let cell_sum = sheet.getRange('B'+3)
  // let account_val = cell_account.getValue()
  // let image_val = cell_sum.getValue()
  // console.log(`tw_id: ${account_val}, len_image: ${image_val}`)

  // console.log(urls)
  // console.log(account_val)
  // console.log(sum_val)
}
