// Block Schedule Data - Week 1
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

// Export the schedule
export const BLOCK_SCHEDULE: WeekSchedule = { week: 1, entries: week1Data }

// Helper function to get all unique providers
export function getAllProviders(): string[] {
  const providers = new Set<string>()
  
  for (const entry of week1Data) {
    for (const provider of Object.values(entry.rooms)) {
      if (provider && provider !== "Open" && provider !== "N/A") {
        providers.add(provider)
      }
    }
  }
  
  return Array.from(providers).sort()
}

// Helper function to get provider schedule for Week 1
export function getProviderSchedule(providerName: string): {
  location: string
  dayOfWeek: string
  block: "AM" | "PM"
  room: string
}[] {
  const schedule: {
    location: string
    dayOfWeek: string
    block: "AM" | "PM"
    room: string
  }[] = []
  
  for (const entry of week1Data) {
    for (const [room, provider] of Object.entries(entry.rooms)) {
      if (provider.toLowerCase() === providerName.toLowerCase()) {
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
