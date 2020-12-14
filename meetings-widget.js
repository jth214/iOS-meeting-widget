// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: calendar-check;

//todo if I'm currently in a meeting, I skip it, so fix that

let time = new DateFormatter();
time.dateFormat = 'HH:mm';

let numMeetings = 30;
let queryDate = new Date();
if (args.plainTexts.length > 0) {
  queryDate = new Date(args.plainTexts[0]);
}
if (args.plainTexts.length > 1) {
  numMeetings = args.plainTexts[1];
}

let allEvents = await CalendarEvent.thisWeek(Calendar.Calendar);

let events = '';
let numMatches = 0;
for (i=0; i<allEvents.length; i++) {  
  if (allEvents[i].calendar.title == 'Calendar') {
    if (allEvents[i].availability == 'busy') {
      if (allEvents[i].startDate >= queryDate || (allEvents[i].startDate < queryDate && allEvents[i].endDate >= queryDate)) {
        events = events + time.string(allEvents[i].startDate) + ' - ' + allEvents[i].title.substring(0, 40) + '\n';
        numMatches++;
        if (numMatches >= numMeetings) {
          break;
        }
      }
    }
  } else {
  }
}
if (events.length == 0) {
  events = "All set today, dude!";
} else {
  console.log(events);
}

if (config.runsInWidget) {
  let widget = createWidget(events)
  widget.presentLarge()
  Script.setWidget(widget)
  Script.complete()
} else {
  let item = events[0]
}

function createWidget(items) {
  let w = new ListWidget()
  w.backgroundColor = new Color("#b00a0f")
  w.backgroundColor = Color.white()
  let authorsTxt = w.addText(items)
  authorsTxt.leftAlignText()
  authorsTxt.textColor = Color.black()
  authorsTxt.textOpacity = 0.8
  return w
}
  
async function loadItems() {
  let url = "https://macstories.net/feed/json"
  let req = new Request(url)
  let json = await req.loadJSON()
  return json.items
}

function extractImageURL(item) {
  let regex = /<img src="(.*)" alt="/
  let html = item["content_html"]
  let matches = html.match(regex)
  if (matches && matches.length >= 2) {
    return matches[1]
  } else {
    return null
  }
}

function decode(str) {
  let regex = /&#(\d+);/g
  return str.replace(regex, (match, dec) => {
    return String.fromCharCode(dec)
  })
}