// Block Schedule Data - All Weeks (1-5)
// This data represents the rotating block schedule for providers across all locations

export interface BlockScheduleEntry {
  location: string
  dayOfWeek: string
  block: "AM" | "PM"
  rooms: { [key: string]: string } // room range -> provider name
}

export interface WeekSchedule {
  week: number
  entries: BlockScheduleEntry[]
}

// Room configurations by location
export const ROOM_CONFIGS = {
  Waltham: [
    "Rooms 1/2",
    "Rooms 3/4",
    "Rooms 5/6",
    "Rooms 7/8",
    "Rooms 9/10",
    "Rooms 11/12",
    "Rooms 13/14",
    "Rooms 15/16",
    "Rooms 17/18",
    "Rooms 19/20",
    "Rooms 21/22",
    "Rooms 23/24",
    "Rooms 25/26",
    "Rooms 27/28",
  ],
  Dedham: ["Rooms 1/2", "Rooms 3/4"],
  Woburn: ["Rooms 1/2", "Rooms 3/4", "Rooms 5/6", "Rooms 7/8", "Rooms 9/10"],
  Westboro: ["Rooms 1/2"],
  Milton: ["Rooms 1/2", "Rooms 3/4"],
} as const

export type Location = keyof typeof ROOM_CONFIGS

export const LOCATIONS: Location[] = ["Waltham", "Dedham", "Woburn", "Westboro", "Milton"]
export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const
export const BLOCKS = ["AM", "PM"] as const

// Helper function to get week number of the month (1-5) for a given date
export function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstMonday = new Date(firstDayOfMonth)
  
  // Find the first Monday of the month (or use the 1st if it's a Monday)
  const dayOfWeek = firstDayOfMonth.getDay()
  if (dayOfWeek !== 1) { // Not Monday
    // Calculate days until next Monday
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek)
    firstMonday.setDate(firstDayOfMonth.getDate() + daysUntilMonday)
  }
  
  // If the date is before the first Monday of the month, it's week 1
  if (date < firstMonday) {
    return 1
  }
  
  // Calculate the week number based on days since first Monday
  const daysSinceFirstMonday = Math.floor((date.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(daysSinceFirstMonday / 7) + 1
  
  // Cap at week 5
  return Math.min(weekNumber, 5)
}

// Helper to get day abbreviation from Date
export function getDayAbbreviation(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days[date.getDay()]
}

// Week 1 Schedule
const week1Data: BlockScheduleEntry[] = [
  // Waltham - Monday
  { location: "Waltham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Kiet", "Rooms 3/4": "Julie", "Rooms 5/6": "Jason", "Rooms 7/8": "Natalie", "Rooms 9/10": "Irene", "Rooms 11/12": "Miller", "Rooms 13/14": "Lisa", "Rooms 15/16": "Jawa", "Rooms 17/18": "McKeon", "Rooms 19/20": "Christina", "Rooms 21/22": "Tom", "Rooms 23/24": "Brian", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Kiet", "Rooms 3/4": "Julie", "Rooms 5/6": "Jason", "Rooms 7/8": "Natalie", "Rooms 9/10": "Irene", "Rooms 11/12": "Miller", "Rooms 13/14": "Lisa", "Rooms 15/16": "Jawa", "Rooms 17/18": "McKeon", "Rooms 19/20": "Christina", "Rooms 21/22": "Tom", "Rooms 23/24": "Brian", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  // Waltham - Tuesday
  { location: "Waltham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Slovenkai", "Rooms 5/6": "Sean", "Rooms 7/8": "VanFlandern", "Rooms 9/10": "Brian", "Rooms 11/12": "Weitzel", "Rooms 13/14": "Kwon", "Rooms 15/16": "Tom", "Rooms 17/18": "Lauren", "Rooms 19/20": "Curtis", "Rooms 21/22": "Natalie", "Rooms 23/24": "Matt", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Slovenkai", "Rooms 5/6": "Sean", "Rooms 7/8": "VanFlandern", "Rooms 9/10": "Brian", "Rooms 11/12": "Weitzel", "Rooms 13/14": "Kwon", "Rooms 15/16": "Tom", "Rooms 17/18": "Lauren", "Rooms 19/20": "Curtis", "Rooms 21/22": "Natalie", "Rooms 23/24": "Matt", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  // Waltham - Wednesday
  { location: "Waltham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Drew", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Lauren", "Rooms 7/8": "Tom", "Rooms 9/10": "Sheri", "Rooms 11/12": "Kim", "Rooms 13/14": "McKeon", "Rooms 15/16": "Christina", "Rooms 17/18": "Matt", "Rooms 19/20": "Miller", "Rooms 21/22": "Stephen", "Rooms 23/24": "Wuerz", "Rooms 25/26": "Mithoefer", "Rooms 27/28": "Braziel" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Drew", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Lauren", "Rooms 7/8": "Alyssa", "Rooms 9/10": "Sheri", "Rooms 11/12": "Kim", "Rooms 13/14": "McKeon", "Rooms 15/16": "Christina", "Rooms 17/18": "Matt", "Rooms 19/20": "Miller", "Rooms 21/22": "Stephen", "Rooms 23/24": "Wuerz", "Rooms 25/26": "Mithoefer", "Rooms 27/28": "Braziel" } },
  // Waltham - Thursday
  { location: "Waltham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Ohaegbulam", "Rooms 3/4": "Natalie", "Rooms 5/6": "Weitzel", "Rooms 7/8": "Curtis", "Rooms 9/10": "Alexis", "Rooms 11/12": "Sheri", "Rooms 13/14": "Stephen", "Rooms 15/16": "Lisa", "Rooms 17/18": "Wuerz", "Rooms 19/20": "Brian", "Rooms 21/22": "Tess", "Rooms 23/24": "Kirsch", "Rooms 25/26": "Sarah", "Rooms 27/28": "Tom" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Ohaegbulam", "Rooms 3/4": "Natalie", "Rooms 5/6": "Weitzel", "Rooms 7/8": "Curtis", "Rooms 9/10": "Alexis", "Rooms 11/12": "Sheri", "Rooms 13/14": "Stephen", "Rooms 15/16": "Lisa", "Rooms 17/18": "Wuerz", "Rooms 19/20": "Brian", "Rooms 21/22": "Tess", "Rooms 23/24": "Open", "Rooms 25/26": "Sean", "Rooms 27/28": "Tom" } },
  // Waltham - Friday
  { location: "Waltham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Jason", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Kirsch", "Rooms 9/10": "Tom", "Rooms 11/12": "Lisa", "Rooms 13/14": "Alyssa", "Rooms 15/16": "Tess", "Rooms 17/18": "Irene", "Rooms 19/20": "Matt", "Rooms 21/22": "Kiet", "Rooms 23/24": "Jawa", "Rooms 25/26": "Open", "Rooms 27/28": "Brian" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Jason", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Kirsch", "Rooms 9/10": "Open", "Rooms 11/12": "Lisa", "Rooms 13/14": "Alyssa", "Rooms 15/16": "Tess", "Rooms 17/18": "Open", "Rooms 19/20": "Matt", "Rooms 21/22": "Kiet", "Rooms 23/24": "Jawa", "Rooms 25/26": "Open", "Rooms 27/28": "Brian" } },
  // Dedham
  { location: "Dedham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Mithoefer", "Rooms 3/4": "Kimball" } },
  { location: "Dedham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Mithoefer", "Rooms 3/4": "Kimball" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Julie", "Rooms 3/4": "Kim" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Julie", "Rooms 3/4": "Kim" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Christina", "Rooms 3/4": "Kirsch" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Wuerz", "Rooms 3/4": "VanFlandern" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Wuerz", "Rooms 3/4": "VanFlandern" } },
  // Woburn
  { location: "Woburn", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Hofmann", "Rooms 3/4": "Christina", "Rooms 5/6": "Tess", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Hofmann", "Rooms 3/4": "Christina", "Rooms 5/6": "Tess", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Weitzel", "Rooms 3/4": "Open", "Rooms 5/6": "Natalie", "Rooms 7/8": "Kwon", "Rooms 9/10": "Sean" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Weitzel", "Rooms 3/4": "Open", "Rooms 5/6": "Natalie", "Rooms 7/8": "Kwon", "Rooms 9/10": "Sean" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Drew", "Rooms 5/6": "Matt", "Rooms 7/8": "Alyssa", "Rooms 9/10": "Dan" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Drew", "Rooms 5/6": "Matt", "Rooms 7/8": "Alyssa", "Rooms 9/10": "Dan" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Sarah", "Rooms 3/4": "Sean", "Rooms 5/6": "Open", "Rooms 7/8": "Kim", "Rooms 9/10": "Lauren" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Sean", "Rooms 5/6": "Open", "Rooms 7/8": "Kim", "Rooms 9/10": "Lauren" } },
  // Westboro
  { location: "Westboro", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  // Milton
  { location: "Milton", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
]

// Week 2 Schedule
const week2Data: BlockScheduleEntry[] = [
  // Waltham
  { location: "Waltham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Lauren", "Rooms 3/4": "Jason", "Rooms 5/6": "Tom", "Rooms 7/8": "Irene", "Rooms 9/10": "Kiet", "Rooms 11/12": "Jawa", "Rooms 13/14": "Lisa", "Rooms 15/16": "Nairus", "Rooms 17/18": "Christina", "Rooms 19/20": "Brian", "Rooms 21/22": "Natalie", "Rooms 23/24": "Miller", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Lauren", "Rooms 3/4": "Jason", "Rooms 5/6": "Tom", "Rooms 7/8": "Irene", "Rooms 9/10": "Kiet", "Rooms 11/12": "Jawa", "Rooms 13/14": "Lisa", "Rooms 15/16": "Nairus", "Rooms 17/18": "Christina", "Rooms 19/20": "Brian", "Rooms 21/22": "Natalie", "Rooms 23/24": "Miller", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Tess", "Rooms 5/6": "Slovenkai", "Rooms 7/8": "Weitzel", "Rooms 9/10": "Tom", "Rooms 11/12": "Sean", "Rooms 13/14": "Kwon", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Kim", "Rooms 19/20": "Natalie", "Rooms 21/22": "Matt", "Rooms 23/24": "Curtis", "Rooms 25/26": "Brian", "Rooms 27/28": "Drew" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Tess", "Rooms 5/6": "Slovenkai", "Rooms 7/8": "Weitzel", "Rooms 9/10": "Tom", "Rooms 11/12": "Sean", "Rooms 13/14": "Kwon", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Kim", "Rooms 19/20": "Natalie", "Rooms 21/22": "Matt", "Rooms 23/24": "Curtis", "Rooms 25/26": "Brian", "Rooms 27/28": "Drew" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Christina", "Rooms 5/6": "Natalie", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "McKeon", "Rooms 11/12": "Miller", "Rooms 13/14": "Stephen", "Rooms 15/16": "Wuerz", "Rooms 17/18": "Kim", "Rooms 19/20": "Braziel", "Rooms 21/22": "Alyssa", "Rooms 23/24": "Sarah", "Rooms 25/26": "Tom", "Rooms 27/28": "Matt" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Christina", "Rooms 5/6": "Natalie", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "McKeon", "Rooms 11/12": "Miller", "Rooms 13/14": "Stephen", "Rooms 15/16": "Wuerz", "Rooms 17/18": "Kim", "Rooms 19/20": "Braziel", "Rooms 21/22": "Alyssa", "Rooms 23/24": "Open", "Rooms 25/26": "Open", "Rooms 27/28": "Matt" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Brian", "Rooms 3/4": "Ohaegbulam", "Rooms 5/6": "Alexis", "Rooms 7/8": "Curtis", "Rooms 9/10": "Wuerz", "Rooms 11/12": "Sheri", "Rooms 13/14": "Natalie", "Rooms 15/16": "Tess", "Rooms 17/18": "Dan", "Rooms 19/20": "Sean", "Rooms 21/22": "Drew", "Rooms 23/24": "Kirsch", "Rooms 25/26": "Kimball", "Rooms 27/28": "Weitzel" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Brian", "Rooms 3/4": "Ohaegbulam", "Rooms 5/6": "Alexis", "Rooms 7/8": "Curtis", "Rooms 9/10": "Alyssa", "Rooms 11/12": "Sheri", "Rooms 13/14": "Natalie", "Rooms 15/16": "Tess", "Rooms 17/18": "Dan", "Rooms 19/20": "Sean", "Rooms 21/22": "Open", "Rooms 23/24": "Kirsch", "Rooms 25/26": "Kimball", "Rooms 27/28": "Tom" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Alexis", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Tess", "Rooms 9/10": "Drew", "Rooms 11/12": "Kim", "Rooms 13/14": "Ohaegbulam", "Rooms 15/16": "Jason", "Rooms 17/18": "Kwon", "Rooms 19/20": "Matt", "Rooms 21/22": "Tom", "Rooms 23/24": "Kiet", "Rooms 25/26": "Jawa", "Rooms 27/28": "Lisa" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Alexis", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Tess", "Rooms 9/10": "Drew", "Rooms 11/12": "Kim", "Rooms 13/14": "Ohaegbulam", "Rooms 15/16": "Jason", "Rooms 17/18": "Kwon", "Rooms 19/20": "Matt", "Rooms 21/22": "Open", "Rooms 23/24": "Kiet", "Rooms 25/26": "Jawa", "Rooms 27/28": "Lisa" } },
  // Dedham
  { location: "Dedham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Stephen", "Rooms 3/4": "Braziel" } },
  { location: "Dedham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Stephen", "Rooms 3/4": "Braziel" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "VanFlandern", "Rooms 3/4": "Hofmann" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "VanFlandern", "Rooms 3/4": "Hofmann" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Drew", "Rooms 3/4": "Weitzel" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Brian", "Rooms 3/4": "Irene" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Brian", "Rooms 3/4": "Irene" } },
  // Woburn
  { location: "Woburn", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Open", "Rooms 7/8": "Kimball", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Open", "Rooms 7/8": "Kimball", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Christina", "Rooms 5/6": "Open", "Rooms 7/8": "Julie", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Christina", "Rooms 5/6": "Open", "Rooms 7/8": "Julie", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Lauren", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Lauren", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Stephen", "Rooms 3/4": "Open", "Rooms 5/6": "Matt", "Rooms 7/8": "Open", "Rooms 9/10": "Hofmann" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Stephen", "Rooms 3/4": "Open", "Rooms 5/6": "Matt", "Rooms 7/8": "Open", "Rooms 9/10": "Hofmann" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Kirsch", "Rooms 3/4": "VanFlandern", "Rooms 5/6": "Mithoefer", "Rooms 7/8": "Christina", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Kirsch", "Rooms 3/4": "VanFlandern", "Rooms 5/6": "Open", "Rooms 7/8": "Christina", "Rooms 9/10": "Open" } },
  // Westboro
  { location: "Westboro", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  // Milton
  { location: "Milton", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
]

// Week 3 Schedule
const week3Data: BlockScheduleEntry[] = [
  // Waltham
  { location: "Waltham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Miller", "Rooms 3/4": "Mithoefer", "Rooms 5/6": "Kiet", "Rooms 7/8": "Natalie", "Rooms 9/10": "Open", "Rooms 11/12": "Baratz", "Rooms 13/14": "Lisa", "Rooms 15/16": "Tom", "Rooms 17/18": "Julie", "Rooms 19/20": "Irene", "Rooms 21/22": "Kimball", "Rooms 23/24": "McKeon", "Rooms 25/26": "Open", "Rooms 27/28": "Christina" } },
  { location: "Waltham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Miller", "Rooms 3/4": "Mithoefer", "Rooms 5/6": "Kiet", "Rooms 7/8": "Natalie", "Rooms 9/10": "Open", "Rooms 11/12": "Baratz", "Rooms 13/14": "Lisa", "Rooms 15/16": "Tom", "Rooms 17/18": "Julie", "Rooms 19/20": "Irene", "Rooms 21/22": "Kimball", "Rooms 23/24": "McKeon", "Rooms 25/26": "Open", "Rooms 27/28": "Christina" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Slovenkai", "Rooms 5/6": "Kwon", "Rooms 7/8": "VanFlandern", "Rooms 9/10": "Brian", "Rooms 11/12": "Weitzel", "Rooms 13/14": "Sean", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Alexis", "Rooms 19/20": "Tom", "Rooms 21/22": "Tess", "Rooms 23/24": "Dan", "Rooms 25/26": "Julie", "Rooms 27/28": "Jason" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Slovenkai", "Rooms 5/6": "Kwon", "Rooms 7/8": "VanFlandern", "Rooms 9/10": "Brian", "Rooms 11/12": "Weitzel", "Rooms 13/14": "Sean", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Alexis", "Rooms 19/20": "Tom", "Rooms 21/22": "Tess", "Rooms 23/24": "Dan", "Rooms 25/26": "Julie", "Rooms 27/28": "Jason" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Kim", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Natalie", "Rooms 7/8": "Sheri", "Rooms 9/10": "Christina", "Rooms 11/12": "Alyssa", "Rooms 13/14": "McKeon", "Rooms 15/16": "Open", "Rooms 17/18": "Open", "Rooms 19/20": "Miller", "Rooms 21/22": "Stephen", "Rooms 23/24": "Wuerz", "Rooms 25/26": "Mithoefer", "Rooms 27/28": "Sarah" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Kim", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Natalie", "Rooms 7/8": "Sheri", "Rooms 9/10": "Christina", "Rooms 11/12": "Alyssa", "Rooms 13/14": "McKeon", "Rooms 15/16": "Open", "Rooms 17/18": "Open", "Rooms 19/20": "Miller", "Rooms 21/22": "Stephen", "Rooms 23/24": "Wuerz", "Rooms 25/26": "Mithoefer", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Stephen", "Rooms 5/6": "Alexis", "Rooms 7/8": "Open", "Rooms 9/10": "Wuerz", "Rooms 11/12": "Ohaegbulam", "Rooms 13/14": "Sheri", "Rooms 15/16": "Hofmann", "Rooms 17/18": "Kim", "Rooms 19/20": "Tess", "Rooms 21/22": "Tom", "Rooms 23/24": "Weitzel", "Rooms 25/26": "Dan", "Rooms 27/28": "Kirsch" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Stephen", "Rooms 5/6": "Alexis", "Rooms 7/8": "Open", "Rooms 9/10": "Wuerz", "Rooms 11/12": "Ohaegbulam", "Rooms 13/14": "Sheri", "Rooms 15/16": "Hofmann", "Rooms 17/18": "Kim", "Rooms 19/20": "Tess", "Rooms 21/22": "Open", "Rooms 23/24": "Weitzel", "Rooms 25/26": "Dan", "Rooms 27/28": "Kirsch" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Brian", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Kiet", "Rooms 9/10": "Tom", "Rooms 11/12": "Tess", "Rooms 13/14": "Open", "Rooms 15/16": "Open", "Rooms 17/18": "Tim", "Rooms 19/20": "Matt", "Rooms 21/22": "Kim", "Rooms 23/24": "Jawa", "Rooms 25/26": "Irene", "Rooms 27/28": "VanFlandern" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Brian", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Kiet", "Rooms 9/10": "Open", "Rooms 11/12": "Tess", "Rooms 13/14": "Open", "Rooms 15/16": "Open", "Rooms 17/18": "Tim", "Rooms 19/20": "Matt", "Rooms 21/22": "Kim", "Rooms 23/24": "Jawa", "Rooms 25/26": "Irene", "Rooms 27/28": "VanFlandern" } },
  // Dedham
  { location: "Dedham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Jawa", "Rooms 3/4": "Jason" } },
  { location: "Dedham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Jawa", "Rooms 3/4": "Jason" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Curtis", "Rooms 3/4": "Miller" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Curtis", "Rooms 3/4": "Miller" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Natalie", "Rooms 3/4": "Tom" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Kirsch", "Rooms 3/4": "Lisa" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Kirsch", "Rooms 3/4": "Lisa" } },
  // Woburn
  { location: "Woburn", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Braziel", "Rooms 7/8": "Lauren", "Rooms 9/10": "Brian" } },
  { location: "Woburn", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Braziel", "Rooms 7/8": "Lauren", "Rooms 9/10": "Brian" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Christina", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Open", "Rooms 7/8": "Matt", "Rooms 9/10": "Natalie" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Christina", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Open", "Rooms 7/8": "Matt", "Rooms 9/10": "Natalie" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Sean", "Rooms 5/6": "Weitzel", "Rooms 7/8": "Tom", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Sean", "Rooms 5/6": "Weitzel", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Alyssa", "Rooms 3/4": "Open", "Rooms 5/6": "Kimball", "Rooms 7/8": "Open", "Rooms 9/10": "Brian" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Alyssa", "Rooms 3/4": "Open", "Rooms 5/6": "Kimball", "Rooms 7/8": "Open", "Rooms 9/10": "Brian" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Jason", "Rooms 5/6": "Lauren", "Rooms 7/8": "Open", "Rooms 9/10": "Kwon" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Jason", "Rooms 5/6": "Lauren", "Rooms 7/8": "Open", "Rooms 9/10": "Kwon" } },
  // Westboro
  { location: "Westboro", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  // Milton
  { location: "Milton", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Tim", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Tim", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
]

// Week 4 Schedule
const week4Data: BlockScheduleEntry[] = [
  // Waltham
  { location: "Waltham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Miller", "Rooms 3/4": "Braziel", "Rooms 5/6": "Lisa", "Rooms 7/8": "Irene", "Rooms 9/10": "Jawa", "Rooms 11/12": "Kiet", "Rooms 13/14": "Mithoefer", "Rooms 15/16": "Lauren", "Rooms 17/18": "Natalie", "Rooms 19/20": "Julie", "Rooms 21/22": "Stephen", "Rooms 23/24": "Jason", "Rooms 25/26": "Christina", "Rooms 27/28": "Brian" } },
  { location: "Waltham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Miller", "Rooms 3/4": "Braziel", "Rooms 5/6": "Lisa", "Rooms 7/8": "Irene", "Rooms 9/10": "Jawa", "Rooms 11/12": "Kiet", "Rooms 13/14": "Mithoefer", "Rooms 15/16": "Lauren", "Rooms 17/18": "Natalie", "Rooms 19/20": "Julie", "Rooms 21/22": "Stephen", "Rooms 23/24": "Jason", "Rooms 25/26": "Christina", "Rooms 27/28": "Brian" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Tess", "Rooms 5/6": "Slovenkai", "Rooms 7/8": "Weitzel", "Rooms 9/10": "Tom", "Rooms 11/12": "Sean", "Rooms 13/14": "Kwon", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Lauren", "Rooms 19/20": "Natalie", "Rooms 21/22": "Open", "Rooms 23/24": "Brian", "Rooms 25/26": "Curtis", "Rooms 27/28": "Julie" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Tess", "Rooms 5/6": "Slovenkai", "Rooms 7/8": "Weitzel", "Rooms 9/10": "Tom", "Rooms 11/12": "Sean", "Rooms 13/14": "Kwon", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Lauren", "Rooms 19/20": "Natalie", "Rooms 21/22": "Open", "Rooms 23/24": "Brian", "Rooms 25/26": "Curtis", "Rooms 27/28": "Julie" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "McKeon", "Rooms 3/4": "Kim", "Rooms 5/6": "Natalie", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "Miller", "Rooms 11/12": "Stephen", "Rooms 13/14": "Wuerz", "Rooms 15/16": "Christina", "Rooms 17/18": "Braziel", "Rooms 19/20": "Alyssa", "Rooms 21/22": "Sarah", "Rooms 23/24": "Sean", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "McKeon", "Rooms 3/4": "Kim", "Rooms 5/6": "Natalie", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "Miller", "Rooms 11/12": "Stephen", "Rooms 13/14": "Open", "Rooms 15/16": "Christina", "Rooms 17/18": "Braziel", "Rooms 19/20": "Alyssa", "Rooms 21/22": "Open", "Rooms 23/24": "Sean", "Rooms 25/26": "Open", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Stephen", "Rooms 3/4": "Alexis", "Rooms 5/6": "Jason", "Rooms 7/8": "Dan", "Rooms 9/10": "Tom", "Rooms 11/12": "Sheri", "Rooms 13/14": "Kirsch", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Matt", "Rooms 19/20": "Brian", "Rooms 21/22": "Weitzel", "Rooms 23/24": "Drew", "Rooms 25/26": "Hofmann", "Rooms 27/28": "Kimball" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Stephen", "Rooms 3/4": "Alexis", "Rooms 5/6": "Jason", "Rooms 7/8": "Curtis", "Rooms 9/10": "Natalie", "Rooms 11/12": "Sheri", "Rooms 13/14": "Kirsch", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Matt", "Rooms 19/20": "Brian", "Rooms 21/22": "Weitzel", "Rooms 23/24": "Drew", "Rooms 25/26": "Hofmann", "Rooms 27/28": "Kimball" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Kirsch", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Jawa", "Rooms 9/10": "Drew", "Rooms 11/12": "Alexis", "Rooms 13/14": "Tom", "Rooms 15/16": "Mithoefer", "Rooms 17/18": "Lisa", "Rooms 19/20": "Irene", "Rooms 21/22": "Kwon", "Rooms 23/24": "Tess", "Rooms 25/26": "Kim", "Rooms 27/28": "Kiet" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Kirsch", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Jawa", "Rooms 9/10": "Drew", "Rooms 11/12": "Alexis", "Rooms 13/14": "Open", "Rooms 15/16": "Mithoefer", "Rooms 17/18": "Lisa", "Rooms 19/20": "Irene", "Rooms 21/22": "Kwon", "Rooms 23/24": "Tess", "Rooms 25/26": "Kim", "Rooms 27/28": "Kiet" } },
  // Dedham
  { location: "Dedham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Nairus", "Rooms 3/4": "Weitzel" } },
  { location: "Dedham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Nairus", "Rooms 3/4": "Weitzel" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Drew", "Rooms 3/4": "VanFlandern" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Drew", "Rooms 3/4": "VanFlandern" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Tess", "Rooms 3/4": "Lauren" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Christina", "Rooms 3/4": "Matt" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Christina", "Rooms 3/4": "Matt" } },
  // Woburn
  { location: "Woburn", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Kimball", "Rooms 7/8": "Open", "Rooms 9/10": "Tom" } },
  { location: "Woburn", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Kimball", "Rooms 7/8": "Open", "Rooms 9/10": "Tom" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Open", "Rooms 5/6": "Christina", "Rooms 7/8": "Kim", "Rooms 9/10": "Matt" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Open", "Rooms 3/4": "Open", "Rooms 5/6": "Christina", "Rooms 7/8": "Kim", "Rooms 9/10": "Matt" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Lauren", "Rooms 3/4": "Open", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Lauren", "Rooms 3/4": "Open", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Wuerz", "Rooms 3/4": "Sean", "Rooms 5/6": "Kwon", "Rooms 7/8": "Lisa", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Wuerz", "Rooms 3/4": "Sean", "Rooms 5/6": "Kwon", "Rooms 7/8": "Lisa", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "VanFlandern", "Rooms 3/4": "Brian", "Rooms 5/6": "Lauren", "Rooms 7/8": "Jason", "Rooms 9/10": "Baratz" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "VanFlandern", "Rooms 3/4": "Brian", "Rooms 5/6": "Lauren", "Rooms 7/8": "Jason", "Rooms 9/10": "Baratz" } },
  // Westboro
  { location: "Westboro", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  // Milton
  { location: "Milton", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Tim", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Tim", "Rooms 3/4": "N/A" } },
]

// Week 5 Schedule
const week5Data: BlockScheduleEntry[] = [
  // Waltham
  { location: "Waltham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Miller", "Rooms 3/4": "Open", "Rooms 5/6": "Jawa", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "Irene", "Rooms 11/12": "Baratz", "Rooms 13/14": "Lisa", "Rooms 15/16": "Julie", "Rooms 17/18": "Natalie", "Rooms 19/20": "Stephen", "Rooms 21/22": "Tom", "Rooms 23/24": "Christina", "Rooms 25/26": "Brian", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Miller", "Rooms 3/4": "Open", "Rooms 5/6": "Jawa", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "Irene", "Rooms 11/12": "Baratz", "Rooms 13/14": "Lisa", "Rooms 15/16": "Julie", "Rooms 17/18": "Natalie", "Rooms 19/20": "Stephen", "Rooms 21/22": "Tom", "Rooms 23/24": "Christina", "Rooms 25/26": "Brian", "Rooms 27/28": "Open" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Slovenkai", "Rooms 5/6": "VanFlandern", "Rooms 7/8": "Natalie", "Rooms 9/10": "Sean", "Rooms 11/12": "Weitzel", "Rooms 13/14": "Kwon", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Alexis", "Rooms 19/20": "Dan", "Rooms 21/22": "Tom", "Rooms 23/24": "Brian", "Rooms 25/26": "Curtis", "Rooms 27/28": "Julie" } },
  { location: "Waltham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Kimball", "Rooms 3/4": "Slovenkai", "Rooms 5/6": "VanFlandern", "Rooms 7/8": "Natalie", "Rooms 9/10": "Sean", "Rooms 11/12": "Weitzel", "Rooms 13/14": "Kwon", "Rooms 15/16": "Ohaegbulam", "Rooms 17/18": "Alexis", "Rooms 19/20": "Dan", "Rooms 21/22": "Tom", "Rooms 23/24": "Brian", "Rooms 25/26": "Curtis", "Rooms 27/28": "Julie" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Tom", "Rooms 7/8": "Lauren", "Rooms 9/10": "Kiet", "Rooms 11/12": "Jawa", "Rooms 13/14": "McKeon", "Rooms 15/16": "Kim", "Rooms 17/18": "Christina", "Rooms 19/20": "Miller", "Rooms 21/22": "Stephen", "Rooms 23/24": "Wuerz", "Rooms 25/26": "Mithoefer", "Rooms 27/28": "Braziel" } },
  { location: "Waltham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Hofmann", "Rooms 5/6": "Open", "Rooms 7/8": "Lauren", "Rooms 9/10": "Kiet", "Rooms 11/12": "Jawa", "Rooms 13/14": "McKeon", "Rooms 15/16": "Kim", "Rooms 17/18": "Christina", "Rooms 19/20": "Miller", "Rooms 21/22": "Stephen", "Rooms 23/24": "Wuerz", "Rooms 25/26": "Mithoefer", "Rooms 27/28": "Braziel" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Alexis", "Rooms 3/4": "Stephen", "Rooms 5/6": "Matt", "Rooms 7/8": "Tom", "Rooms 9/10": "Sheri", "Rooms 11/12": "Ohaegbulam", "Rooms 13/14": "Wuerz", "Rooms 15/16": "Brian", "Rooms 17/18": "Lauren", "Rooms 19/20": "Natalie", "Rooms 21/22": "Kim", "Rooms 23/24": "Kirsch", "Rooms 25/26": "Sarah", "Rooms 27/28": "Weitzel" } },
  { location: "Waltham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Alexis", "Rooms 3/4": "Stephen", "Rooms 5/6": "Matt", "Rooms 7/8": "Curtis", "Rooms 9/10": "Sheri", "Rooms 11/12": "Ohaegbulam", "Rooms 13/14": "Wuerz", "Rooms 15/16": "Brian", "Rooms 17/18": "Lauren", "Rooms 19/20": "Natalie", "Rooms 21/22": "Kim", "Rooms 23/24": "Alyssa", "Rooms 25/26": "Sean", "Rooms 27/28": "Weitzel" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Jason", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Wuerz", "Rooms 9/10": "Tom", "Rooms 11/12": "Drew", "Rooms 13/14": "Kiet", "Rooms 15/16": "Lisa", "Rooms 17/18": "Jawa", "Rooms 19/20": "Matt", "Rooms 21/22": "Tim", "Rooms 23/24": "Kirsch", "Rooms 25/26": "VanFlandern", "Rooms 27/28": "Brian" } },
  { location: "Waltham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Jason", "Rooms 3/4": "Julie", "Rooms 5/6": "Sheri", "Rooms 7/8": "Wuerz", "Rooms 9/10": "Irene", "Rooms 11/12": "Drew", "Rooms 13/14": "Kiet", "Rooms 15/16": "Tess", "Rooms 17/18": "Jawa", "Rooms 19/20": "Matt", "Rooms 21/22": "Tim", "Rooms 23/24": "Kirsch", "Rooms 25/26": "VanFlandern", "Rooms 27/28": "Brian" } },
  // Dedham
  { location: "Dedham", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Kiet", "Rooms 3/4": "Kimball" } },
  { location: "Dedham", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Kiet", "Rooms 3/4": "Kimball" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Hofmann", "Rooms 3/4": "Drew" } },
  { location: "Dedham", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Hofmann", "Rooms 3/4": "Drew" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Kirsch", "Rooms 3/4": "Tom" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Dedham", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  // Woburn
  { location: "Woburn", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Sheri", "Rooms 3/4": "Alexis", "Rooms 5/6": "Open", "Rooms 7/8": "Open", "Rooms 9/10": "Open" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Tess", "Rooms 3/4": "Christina", "Rooms 5/6": "Kim", "Rooms 7/8": "Matt", "Rooms 9/10": "Lauren" } },
  { location: "Woburn", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Tess", "Rooms 3/4": "Christina", "Rooms 5/6": "Kim", "Rooms 7/8": "Matt", "Rooms 9/10": "Lauren" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Natalie", "Rooms 3/4": "Alyssa", "Rooms 5/6": "Open", "Rooms 7/8": "Weitzel", "Rooms 9/10": "Sean" } },
  { location: "Woburn", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Natalie", "Rooms 3/4": "Alyssa", "Rooms 5/6": "Open", "Rooms 7/8": "Weitzel", "Rooms 9/10": "Sean" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "Tess", "Rooms 3/4": "Drew", "Rooms 5/6": "Hofmann", "Rooms 7/8": "Kimball", "Rooms 9/10": "Dan" } },
  { location: "Woburn", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "Tess", "Rooms 3/4": "Drew", "Rooms 5/6": "Hofmann", "Rooms 7/8": "Kimball", "Rooms 9/10": "Dan" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Dan", "Rooms 5/6": "Open", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "Lauren" } },
  { location: "Woburn", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Sean", "Rooms 3/4": "Dan", "Rooms 5/6": "Open", "Rooms 7/8": "Mithoefer", "Rooms 9/10": "Lauren" } },
  // Westboro
  { location: "Westboro", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "Dan" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "Nairus" } },
  { location: "Westboro", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "Nairus" } },
  // Milton
  { location: "Milton", dayOfWeek: "Mon", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Mon", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Tue", block: "AM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Tue", block: "PM", rooms: { "Rooms 1/2": "Baratz", "Rooms 3/4": "Tim" } },
  { location: "Milton", dayOfWeek: "Wed", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Wed", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Thu", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "AM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
  { location: "Milton", dayOfWeek: "Fri", block: "PM", rooms: { "Rooms 1/2": "N/A", "Rooms 3/4": "N/A" } },
]

// All weeks data
export const ALL_WEEKS: WeekSchedule[] = [
  { week: 1, entries: week1Data },
  { week: 2, entries: week2Data },
  { week: 3, entries: week3Data },
  { week: 4, entries: week4Data },
  { week: 5, entries: week5Data },
]

// Get schedule for a specific week
export function getWeekSchedule(weekNumber: number): BlockScheduleEntry[] {
  const week = ALL_WEEKS.find(w => w.week === weekNumber)
  return week?.entries || week1Data
}

// Get schedule for a specific date (auto-determines week)
export function getScheduleForDate(date: Date): { weekNumber: number; entries: BlockScheduleEntry[] } {
  const weekNumber = getWeekOfMonth(date)
  return {
    weekNumber,
    entries: getWeekSchedule(weekNumber)
  }
}

// Helper function to get all unique providers across all weeks
export function getAllProviders(): string[] {
  const providers = new Set<string>()
  
  for (const week of ALL_WEEKS) {
    for (const entry of week.entries) {
      for (const provider of Object.values(entry.rooms)) {
        if (provider && provider !== "Open" && provider !== "N/A") {
          providers.add(provider.trim())
        }
      }
    }
  }
  
  return Array.from(providers).sort()
}

// Helper function to get provider schedule for a specific week
export function getProviderSchedule(providerName: string, weekNumber: number = 1): {
  location: string
  dayOfWeek: string
  block: "AM" | "PM"
  room: string
}[] {
  const weekData = getWeekSchedule(weekNumber)
  const schedule: {
    location: string
    dayOfWeek: string
    block: "AM" | "PM"
    room: string
  }[] = []
  
  for (const entry of weekData) {
    for (const [room, provider] of Object.entries(entry.rooms)) {
      if (provider.toLowerCase().trim() === providerName.toLowerCase().trim()) {
        schedule.push({
          location: entry.location,
          dayOfWeek: entry.dayOfWeek,
          block: entry.block,
          room,
        })
      }
    }
  }
  
  return schedule
}

// Legacy export for backwards compatibility
export const BLOCK_SCHEDULE: WeekSchedule = { week: 1, entries: week1Data }
