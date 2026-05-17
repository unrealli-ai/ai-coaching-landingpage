/**
 * Google Apps Script setup:
 * 1. Create a Google Spreadsheet.
 * 2. Copy the spreadsheet ID into SPREADSHEET_ID.
 * 3. Open Apps Script and paste this entire file into Code.gs.
 * 4. Deploy > New deployment > Web app.
 * 5. Execute as: Me.
 * 6. Who has access: Anyone.
 * 7. Copy the Web App URL.
 * 8. Paste it into APPS_SCRIPT_WEB_APP_URL in the frontend.
 */

var SPREADSHEET_ID = "";

var TEST_RESPONSE_SHEET_NAME = "test_responses";
var REPORT_REQUEST_SHEET_NAME = "report_requests";
var EVENT_LOG_SHEET_NAME = "event_logs";

var TEST_RESPONSE_HEADERS = [
  "submitted_at",
  "session_id",
  "attempt_id",
  "source",
  "campaign",
  "adset",
  "ad",
  "creative",
  "q1_score",
  "q1_answer",
  "q2_score",
  "q2_answer",
  "q3_score",
  "q3_answer",
  "q4_score",
  "q4_task_type",
  "q4_answer",
  "q5_score",
  "q5_answer",
  "q5_bottleneck",
  "q6_task_type",
  "q7_score",
  "q7_answer",
  "q8_needed_help",
  "free_text_task",
  "total_score",
  "result_level",
  "result_title",
  "primary_offer_fit",
  "task_tag",
  "user_agent"
];

var REPORT_REQUEST_HEADERS = [
  "submitted_at",
  "session_id",
  "attempt_id",
  "source",
  "campaign",
  "adset",
  "ad",
  "creative",
  "nickname",
  "email",
  "report_task",
  "q4_task_type",
  "q4_answer",
  "q5_score",
  "q5_answer",
  "q5_bottleneck",
  "q6_task_type",
  "q8_needed_help",
  "result_level",
  "result_title",
  "total_score",
  "primary_offer_fit",
  "task_tag",
  "consent"
];

var EVENT_LOG_HEADERS = [
  "logged_at",
  "session_id",
  "attempt_id",
  "event_name",
  "source",
  "campaign",
  "adset",
  "ad",
  "creative",
  "result_level",
  "result_title",
  "total_score",
  "properties",
  "user_agent"
];

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    lock.waitLock(5000);

    var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var payload = JSON.parse(rawBody);

    if (!payload.submitted_at) {
      payload.submitted_at = new Date().toISOString();
    }

    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (payload.type === "test_response") {
      var testSheetData = getOrCreateSheet_(spreadsheet, TEST_RESPONSE_SHEET_NAME, TEST_RESPONSE_HEADERS);
      appendPayload_(testSheetData.sheet, testSheetData.headers, payload);
    } else if (payload.type === "report_request") {
      var reportSheetData = getOrCreateSheet_(spreadsheet, REPORT_REQUEST_SHEET_NAME, REPORT_REQUEST_HEADERS);
      appendPayload_(reportSheetData.sheet, reportSheetData.headers, payload);
    } else if (payload.type === "event_log") {
      if (!payload.logged_at) {
        payload.logged_at = new Date().toISOString();
      }
      var eventSheetData = getOrCreateSheet_(spreadsheet, EVENT_LOG_SHEET_NAME, EVENT_LOG_HEADERS);
      appendPayload_(eventSheetData.sheet, eventSheetData.headers, payload);
    } else {
      throw new Error("Unknown payload type: " + payload.type);
    }

    return jsonResponse_({
      success: true,
      type: payload.type
    });
  } catch (error) {
    return jsonResponse_({
      success: false,
      error: String(error && error.message ? error.message : error)
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (releaseError) {
      // Ignore release errors.
    }
  }
}

function getOrCreateSheet_(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  var firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var hasHeaders = false;

  for (var i = 0; i < firstRow.length; i += 1) {
    if (String(firstRow[i] || "").trim() !== "") {
      hasHeaders = true;
      break;
    }
  }

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return {
      sheet: sheet,
      headers: headers
    };
  }

  var activeHeaders = firstRow.map(function (value) {
    return String(value || "").trim();
  }).filter(function (value) {
    return value !== "";
  });

  var missingHeaders = headers.filter(function (header) {
    return activeHeaders.indexOf(header) === -1;
  });

  if (missingHeaders.length > 0) {
    sheet.getRange(1, activeHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
    activeHeaders = activeHeaders.concat(missingHeaders);
  }

  return {
    sheet: sheet,
    headers: activeHeaders
  };
}

function appendPayload_(sheet, headers, payload) {
  var row = [];

  for (var i = 0; i < headers.length; i += 1) {
    row.push(normalizeCellValue_(payload[headers[i]]));
  }

  sheet.appendRow(row);
}

function normalizeCellValue_(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    var items = [];

    for (var i = 0; i < value.length; i += 1) {
      var item = normalizeArrayItem_(value[i]);
      if (item) {
        items.push(item);
      }
    }

    return items.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
}

function normalizeArrayItem_(item) {
  if (item === undefined || item === null) {
    return "";
  }

  if (typeof item === "object") {
    if (item.label !== undefined) {
      return String(item.label);
    }

    if (item.value !== undefined) {
      return String(item.value);
    }

    return JSON.stringify(item);
  }

  return String(item);
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
