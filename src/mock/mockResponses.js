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

// Scenario 1: user asks "Book an appointment with a cardiologist"
export const mockCardiologySearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "I found 3 cardiologists available this week. Tap a card to book a slot:",
    doctors: [
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
        nextSlot: "Fri, 2:00 PM",
        rating: 4.9,
        slots: ["Fri, 2:00 PM", "Fri, 5:00 PM"],
      },
    ],
  },
};

export const mockOrthopedicsSearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "I found 3 orthopedic specialists available soon. Choose a doctor to view slots:",
    doctors: [
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
      {
        id: "doc_203",
        name: "Dr. Rohan Pillai",
        department: "Orthopedics",
        image: "https://randomuser.me/api/portraits/men/76.jpg",
        availability: "busy",
        nextSlot: "Mon, 11:00 AM",
        rating: 4.8,
        slots: ["Mon, 11:00 AM", "Mon, 2:00 PM"],
      },
    ],
  },
};

export const mockPediatricsSearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "I found 3 pediatricians available this week. Tap a card to see available slots:",
    doctors: [
      {
        id: "doc_301",
        name: "Dr. Meera Iyer",
        department: "Pediatrics",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        availability: "available",
        nextSlot: "Today, 2:30 PM",
        rating: 4.9,
        slots: ["2:30 PM", "3:15 PM", "5:00 PM"],
      },
      {
        id: "doc_302",
        name: "Dr. Arjun Nair",
        department: "Pediatrics",
        image: "https://randomuser.me/api/portraits/men/57.jpg",
        availability: "available",
        nextSlot: "Tomorrow, 10:30 AM",
        rating: 4.7,
        slots: ["10:30 AM", "12:00 PM", "4:00 PM"],
      },
      {
        id: "doc_303",
        name: "Dr. Shreya Menon",
        department: "Pediatrics",
        image: "https://randomuser.me/api/portraits/women/71.jpg",
        availability: "busy",
        nextSlot: "Wed, 9:00 AM",
        rating: 4.8,
        slots: ["Wed, 9:00 AM", "Wed, 1:00 PM"],
      },
    ],
  },
};

export const mockAllDoctorsSearch = {
  sessionId: "demo-session",
  reply: {
    type: "doctor-list",
    text: "Here are some specialists you can consult. Choose a doctor to view the next available appointment:",
    doctors: [
      {
        id: "doc_401",
        name: "Dr. Ananya Rao",
        department: "Cardiology",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        availability: "available",
        nextSlot: "Today, 4:30 PM",
        rating: 4.8,
        slots: ["10:00 AM", "1:00 PM", "4:30 PM", "6:00 PM"],
      },
      {
        id: "doc_402",
        name: "Dr. Suresh Nair",
        department: "Orthopedics",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        availability: "available",
        nextSlot: "Today, 6:00 PM",
        rating: 4.7,
        slots: ["1:00 PM", "3:30 PM", "6:00 PM"],
      },
      {
        id: "doc_403",
        name: "Dr. Meera Iyer",
        department: "Pediatrics",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        availability: "available",
        nextSlot: "Today, 2:30 PM",
        rating: 4.9,
        slots: ["2:30 PM", "3:15 PM", "5:00 PM"],
      },
    ],
  },
};

// Scenario 2: user asks "I want to see Dr. Mani" but Dr. Mani is fully
// booked - backend returns a graceful fallback with alternatives.
export const mockUnavailableFallback = {
  sessionId: "demo-session",
  reply: {
    type: "fallback",
    text: "Dr. Mani is fully booked until next Monday. Here are highly-rated Orthopedic doctors available sooner:",
    doctors: [
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
    ],
  },
};

// Scenario 3: plain conversational text reply, no cards (also the
// "Timings" quick-link reply)
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

// Booking confirmation returned once a time slot has been picked from a
// SlotPicker message (see confirmBooking in useChatSession.js).
export const mockBookingConfirmation = {
  status: "confirmed",
  message: "A confirmation SMS with your appointment details has been sent to the registered mobile number.",
};
