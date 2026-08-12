/**
 * mockResponses.js
 * ----------------
 * Example payload shapes the Node.js backend is expected to return from
 * POST /api/chat/message. useChatSession.js (see MOCK_MODE) uses these
 * to simulate the network so the widget is fully demoable offline.
 *
 * Contract summary:
 * {
 *   sessionId: string,
 *   reply: {
 *     type: "text" | "doctor-list" | "fallback",
 *     text: string,              // always present - shown above cards too
 *     doctors?: Doctor[]         // present when type is "doctor-list" or
 *                                 // "fallback" (fallback = alternates)
 *   }
 * }
 *
 * Doctor shape:
 * {
 *   id, name, department, image, availability: "available" | "busy",
 *   nextSlot, rating, slots: string[]   // offered when "Book Slot" is tapped
 * }
 */

// Default slot options offered when a doctor doesn't specify their own.
export const DEFAULT_SLOTS = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];

export const MOCK_DOCTORS_LIST = [
  // --- Cardiology ---
  {
    id: "doc_101",
    name: "Dr. Ananya Rao",
    department: "Cardiology",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    availability: "available",
    nextSlot: "Today, 4:30 PM",
    rating: 4.8,
    slots: ["10:00 AM", "1:00 PM", "4:30 PM", "6:00 PM"],
  },
  {
    id: "doc_102",
    name: "Dr. Karthik Iyer",
    department: "Cardiology",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    availability: "available",
    nextSlot: "Tomorrow, 10:00 AM",
    rating: 4.6,
    slots: ["9:30 AM", "11:00 AM", "3:00 PM"],
  },
  {
    id: "doc_103",
    name: "Dr. Priya Menon",
    department: "Cardiology",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    availability: "busy",
    nextSlot: "Fully booked this week",
    rating: 4.9,
    slots: [],
  },

  // --- Orthopedics ---
  {
    id: "doc_201",
    name: "Dr. Suresh Nair",
    department: "Orthopedics",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    availability: "available",
    nextSlot: "Today, 6:00 PM",
    rating: 4.7,
    slots: ["1:00 PM", "3:30 PM", "6:00 PM"],
  },
  {
    id: "doc_202",
    name: "Dr. Fatima Sheikh",
    department: "Orthopedics",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    availability: "available",
    nextSlot: "Tomorrow, 9:30 AM",
    rating: 4.5,
    slots: ["9:30 AM", "12:00 PM", "5:00 PM"],
  },

  // --- Pediatrics ---
  {
    id: "doc_301",
    name: "Dr. Meera Vasudevan",
    department: "Pediatrics",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    availability: "available",
    nextSlot: "Today, 5:00 PM",
    rating: 4.9,
    slots: ["10:30 AM", "2:00 PM", "5:00 PM"],
  },
  {
    id: "doc_302",
    name: "Dr. Rajesh Sharma",
    department: "Pediatrics",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    availability: "available",
    nextSlot: "Tomorrow, 11:00 AM",
    rating: 4.8,
    slots: ["11:00 AM", "3:30 PM", "6:30 PM"],
  },
];

// All doctors across Cardiology, Orthopedics, and Pediatrics
export const mockAllDoctorsSearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "Here are our top specialists across Cardiology, Orthopedics, and Pediatrics. Tap a card to book a slot:",
    doctors: MOCK_DOCTORS_LIST,
  },
};

// Cardiology department search
export const mockCardiologySearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "I found 3 Cardiology specialists available this week (2 ready to book, 1 fully booked). Tap a card to book a slot or get notified:",
    doctors: MOCK_DOCTORS_LIST.filter((d) => d.department === "Cardiology"),
  },
};

// Orthopedics department search
export const mockOrthopedicsSearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "I found 2 Orthopedics specialists available this week. Tap a card to book a slot:",
    doctors: MOCK_DOCTORS_LIST.filter((d) => d.department === "Orthopedics"),
  },
};

// Pediatrics department search
export const mockPediatricsSearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "I found 2 Pediatrics specialists available this week. Tap a card to book a slot:",
    doctors: MOCK_DOCTORS_LIST.filter((d) => d.department === "Pediatrics"),
  },
};

// Scenario 2: user asks "I want to see Dr. Mani" but Dr. Mani is fully
// booked - backend returns a graceful fallback with alternatives.
export const mockUnavailableFallback = {
  sessionId: "demo-session",
  reply: {
    type: "fallback",
    text: "Dr. Mani is fully booked until next Monday. Here are highly-rated Orthopedic doctors available sooner:",
    doctors: MOCK_DOCTORS_LIST.filter((d) => d.department === "Orthopedics"),
  },
};

// Scenario 3: plain conversational text reply, no cards
export const mockPlainTextReply = {
  sessionId: "demo-session",
  reply: {
    type: "text",
    text: "Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM. Would you like help booking a visit?",
  },
};

// "Enquiry" quick link
export const mockEnquiryReply = {
  sessionId: "demo-session",
  reply: {
    type: "text",
    text: "Sure — you can ask me about specific doctors, departments, insurance, or test reports. What would you like to know?",
  },
};

// "Address" quick link
export const mockAddressReply = {
  sessionId: "demo-session",
  reply: {
    type: "text",
    text: "Sunrise Multispecialty Hospital, 4th Cross Road, Anna Nagar, Chennai - 600040. Landmark: Opposite Anna Nagar Tower Park.",
  },
};

// "Request Live Agent" quick link
export const mockLiveAgentReply = {
  sessionId: "demo-session",
  reply: {
    type: "text",
    text: "Connecting you to a live agent now — an executive will join this chat shortly. Average wait time is under 3 minutes.",
  },
};

// Booking confirmation
export const mockBookingConfirmation = {
  status: "confirmed",
  message: "A confirmation SMS with your appointment details has been sent to the registered mobile number.",
};
