import { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const allowCors =
  (fn: (req: VercelRequest, res: VercelResponse) => any) =>
  async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  };

module.exports = allowCors(async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (!GOOGLE_API_KEY) {
      throw 'Error, GOOGLE_API_KEY is empty';
    }

    if (!SPREADSHEET_ID) {
      throw 'Error, SPREADSHEET_ID is empty';
    }

    if (!req.query?.email && typeof req.query?.email === 'string') {
      throw 'Упс... Email введён неправильно';
    }

    const auth = google.auth.fromAPIKey(GOOGLE_API_KEY);
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A:A',
      valueInputOption: "USER_ENTERED",
      requestBody: {
        "values": [
          [
            req.query?.email
          ]
        ]
      }
    });
  } catch (err) {
    console.error(err);
    res.json({
      error: true
    })
  }

  res.json({
    success: true
  });
});
