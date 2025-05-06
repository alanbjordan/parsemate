from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os.path
import pickle
from typing import List, Dict, Any

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

class GoogleSheetsService:
    def __init__(self, spreadsheet_id: str):
        self.spreadsheet_id = spreadsheet_id
        self.creds = None
        self.service = None
        self._authenticate()

    def _authenticate(self):
        """Handles authentication with Google Sheets API."""
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                self.creds = pickle.load(token)

        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', SCOPES)
                self.creds = flow.run_local_server(port=0)
            
            with open('token.pickle', 'wb') as token:
                pickle.dump(self.creds, token)

        self.service = build('sheets', 'v4', credentials=self.creds)

    def read_range(self, range_name: str) -> List[List[Any]]:
        """Read data from a specific range in the spreadsheet."""
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_name
            ).execute()
            return result.get('values', [])
        except Exception as e:
            print(f"Error reading from Google Sheets: {e}")
            return []

    def write_range(self, range_name: str, values: List[List[Any]]) -> bool:
        """Write data to a specific range in the spreadsheet."""
        try:
            body = {
                'values': values
            }
            result = self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range=range_name,
                valueInputOption='RAW',
                body=body
            ).execute()
            return True
        except Exception as e:
            print(f"Error writing to Google Sheets: {e}")
            return False

    def append_rows(self, range_name: str, values: List[List[Any]]) -> bool:
        """Append rows to the end of a range in the spreadsheet."""
        try:
            body = {
                'values': values
            }
            result = self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=range_name,
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body=body
            ).execute()
            return True
        except Exception as e:
            print(f"Error appending to Google Sheets: {e}")
            return False 