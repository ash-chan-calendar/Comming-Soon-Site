# スプレッドシートを受け取って{ythonでリネームする
import gspread
import config #for secret
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
secret_json = ""
credentials = ServiceAccountCredentials.from_json_keyfile_name(secret_json, scope)

gc = gspread.authorize(credentials)
SPREADSHEET_KEY = config.SPREADSHEET_KEY
sheet = gc.open_by_key(config.SPREADSHEET_KEY)
# sheet = gc.open('アッシュちゃんカレンダー（回答）')
# worksheet = sheet.worksheet('フォームの回答 1')
worksheet = sheet.sheet1
twitter_id_list = worksheet.col_values(2)
# @の除去
twitter_id_list = twitter_id_list[15].replace('@','')
# cell = worksheet.acell('A1').value
print(twitter_id_list)
# print(cell)
# with open(secret_json) as f1:
    # print(f1.read())