/**
 * Hospital Omnichannel CRM Mock Dataset
 * Real-world multi-channel healthcare support conversations:
 * WhatsApp, Messenger, Instagram, Threads, LinkedIn, Webchat, Email
 */

export const CHANNELS = [
  { id: "all", label: "All Channels", color: "#475569" },
  { id: "whatsapp", label: "WhatsApp", color: "#25D366", icon: "whatsapp" },
  { id: "webchat", label: "Webchat", color: "#0d9488", icon: "webchat" },
  { id: "messenger", label: "Messenger", color: "#0084FF", icon: "messenger" },
  { id: "instagram", label: "Instagram", color: "#E1306C", icon: "instagram" },
  { id: "threads", label: "Threads", color: "#000000", icon: "threads" },
  { id: "email", label: "Email", color: "#6366f1", icon: "email" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2", icon: "linkedin" },
];

export const STAFF_MEMBERS = [
  { id: "staff_1", name: "Dr. Rajesh Sharma", role: "Chief of Cardiology", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face" },
  { id: "staff_2", name: "Priya Nair", role: "Care Coordinator", avatar: "https://images.unsplash.com/photo-1594824813508-b64fd48b8b42?w=100&h=100&fit=crop&crop=face" },
  { id: "staff_3", name: "Dr. Sunita Rao", role: "OB-GYN Consultant", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" },
  { id: "staff_4", name: "Vikram Mehta", role: "Patient Intake Lead", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { id: "staff_5", name: "Megan Chen", role: "Digital Front Desk", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
];

export const QUICK_REPLIES = [
  { id: "qr_1", title: "OPD Booking Link", tag: "@booking", body: "Here is your direct booking link for OPD Consultation with Dr. Sharma: https://apple.health/slot/cardio-104. Please pick your preferred time slot." },
  { id: "qr_2", title: "Lab Fasting Instructions", tag: "@fasting", body: "For your fasting blood glucose and lipid profile, please fast for 10-12 hours overnight. Plain water is permitted. Please report to Room 102 by 08:00 AM." },
  { id: "qr_3", title: "Hospital Location & Parking", tag: "@location", body: "Our main campus is at 104 Bannerghatta Road, Bengaluru. Multi-level patient parking is available at Gate 2 with valet service." },
  { id: "qr_4", title: "Health Checkup Packages", tag: "@packages", body: "We offer comprehensive Master Health Checkups starting at ₹2,499. Includes 68 blood parameters, ECG, Chest X-Ray, and Physician consult." },
  { id: "qr_5", title: "Insurance & TPA Helpdesk", tag: "@insurance", body: "Our Cashless TPA Desk is on the Ground Floor, Counter 6. Please carry your original insurance e-card and photo ID." },
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "conv_1",
    patientName: "Benjamin Morataya",
    uhid: "UHID-98214",
    phone: "+91 98765 43210",
    email: "benjamin.m@gmail.com",
    channel: "email",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    age: 34,
    gender: "Male",
    city: "Bengaluru",
    preferredLanguage: "English",
    department: "Cardiology",
    leadSource: "Email Outreach",
    leadStatus: "Contacted",
    priority: "High",
    status: "open", // "open" | "resolved" | "snoozed"
    assignedTo: "staff_5", // Megan Chen
    starred: true,
    lastActivity: "4 min ago",
    unreadCount: 0,
    topic: "Consultation query for Pediatric Cardiology & Second Opinion",
    appointment: {
      status: "Scheduled",
      date: "Tomorrow, 10:30 AM",
      doctor: "Dr. Rajesh Sharma, MD",
      department: "Cardiology Room 104",
      type: "In-Person Consultation",
    },
    todos: [
      { id: "todo_1", title: "Request echocardiogram records from previous hospital", tag: "Records", status: "In Progress", assignee: "Priya Nair" },
      { id: "todo_2", title: "Send appointment reminder 2 hours prior", tag: "WhatsApp", status: "To Do", assignee: "Megan Chen" },
    ],
    messages: [
      {
        id: "m_1",
        sender: "patient",
        senderName: "Benjamin Morataya",
        text: "Hi Care Team, my 6-year-old son was diagnosed with a mild ventricular septal murmur. We want a pediatric cardiology second opinion with Dr. Rajesh Sharma. What are his availability days this week?",
        timestamp: "Today, 10:45 AM",
        channel: "email",
      },
      {
        id: "m_2",
        sender: "note",
        senderName: "Priya Nair (Care Coordinator)",
        text: "Note: Dr. Sharma is in OPD on Tue & Thu 10:00 AM - 02:00 PM. Patient has previous echo reports in PDF. Ready to offer 10:30 AM tomorrow.",
        timestamp: "Today, 11:00 AM",
        channel: "internal_note",
      },
      {
        id: "m_3",
        sender: "agent",
        senderName: "Megan Chen (Digital Front Desk)",
        text: "Hi Benjamin,\n\nThank you for reaching out to us. We would be happy to assist you and your son. Dr. Rajesh Sharma is available for pediatric cardiac consultations tomorrow at 10:30 AM.\n\nCould you please confirm if you would like us to reserve this slot? Also, please bring any previous echocardiogram or pediatric reports.\n\nTake care,\nMegan",
        timestamp: "Today, 11:05 AM",
        channel: "email",
        seen: true,
      },
    ],
  },
  {
    id: "conv_2",
    patientName: "Anita Verma",
    uhid: "UHID-10482",
    phone: "+91 98451 77234",
    email: "anita.verma@outlook.com",
    channel: "whatsapp",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    age: 28,
    gender: "Female",
    city: "Bengaluru (Koramangala)",
    preferredLanguage: "Hindi / English",
    department: "Obstetrics & Gynecology",
    leadSource: "WhatsApp Ad Campaign",
    leadStatus: "Appointment Booked",
    priority: "Urgent",
    status: "open",
    assignedTo: "staff_2", // Priya Nair
    starred: true,
    lastActivity: "12 min ago",
    unreadCount: 2,
    topic: "2nd Trimester Hyperemesis & IV Fluid Advice",
    appointment: {
      status: "Confirmed",
      date: "Today, 02:30 PM",
      doctor: "Dr. Sunita Rao, DGO",
      department: "OB-GYN Suite 202",
      type: "Emergency Outpatient",
    },
    todos: [
      { id: "todo_3", title: "Arrange wheel chair at OPD Porch on arrival", tag: "Accessibility", status: "In Progress", assignee: "Priya Nair" },
    ],
    messages: [
      {
        id: "m_201",
        sender: "patient",
        senderName: "Anita Verma",
        text: "Namaste, I am 22 weeks pregnant. Since morning I have severe vomiting and dizziness, cannot keep fluids down. Can Dr. Sunita see me urgently today?",
        timestamp: "Today, 11:15 AM",
        channel: "whatsapp",
      },
      {
        id: "m_202",
        sender: "agent",
        senderName: "Priya Nair",
        text: "Hello Anita ji, please do not worry. We have slotted you for an urgent priority consult with Dr. Sunita Rao at 02:30 PM today. Please have someone drive you, and keep small sips of ORS.",
        timestamp: "Today, 11:18 AM",
        channel: "whatsapp",
        seen: true,
      },
      {
        id: "m_203",
        sender: "patient",
        senderName: "Anita Verma",
        text: "Thank you so much Priya. My husband is bringing me now. Can we get wheelchair assistance at the gate?",
        timestamp: "Today, 11:22 AM",
        channel: "whatsapp",
      },
    ],
  },
  {
    id: "conv_3",
    patientName: "Vikram Singh",
    uhid: "UHID-10483",
    phone: "+91 97410 88219",
    email: "vikram.singh99@gmail.com",
    channel: "webchat",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    age: 45,
    gender: "Male",
    city: "Bengaluru (Indiranagar)",
    preferredLanguage: "English",
    department: "Radiology & Orthopedics",
    leadSource: "Website Live Widget",
    leadStatus: "New Lead",
    priority: "Medium",
    status: "open",
    assignedTo: null, // Unassigned
    starred: false,
    lastActivity: "28 min ago",
    unreadCount: 1,
    topic: "MRI Lumbar Spine pricing and contrast prep query",
    appointment: null,
    todos: [
      { id: "todo_4", title: "Verify TPA cashless authorization with Star Health", tag: "TPA", status: "To Do", assignee: "Vikram Mehta" },
    ],
    messages: [
      {
        id: "m_301",
        sender: "patient",
        senderName: "Vikram Singh",
        text: "Hi, my orthopedist advised a 3 Tesla MRI Lumbar Spine with contrast. What is your charge, and do I need to fast before the scan?",
        timestamp: "Today, 10:55 AM",
        channel: "webchat",
      },
      {
        id: "m_302",
        sender: "note",
        senderName: "AI Triage Bot",
        text: "AI Note: Detected intent 'Radiology MRI'. Normal 3T MRI Spine rate: ₹8,500. Serum Creatinine test mandatory within last 30 days for IV contrast.",
        timestamp: "Today, 10:56 AM",
        channel: "internal_note",
      },
    ],
  },
  {
    id: "conv_4",
    patientName: "Sarah Miller",
    uhid: "UHID-10521",
    phone: "+91 99012 34567",
    email: "sarah.miller@techcorp.io",
    channel: "instagram",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    age: 52,
    gender: "Female",
    city: "Bengaluru",
    preferredLanguage: "English",
    department: "Wellness & Preventive Health",
    leadSource: "Instagram DM",
    leadStatus: "Follow-up Required",
    priority: "Medium",
    status: "open",
    assignedTo: "staff_4", // Vikram Mehta
    starred: false,
    lastActivity: "1 hr ago",
    unreadCount: 0,
    topic: "Senior Citizen Comprehensive Health Checkup Package",
    appointment: null,
    todos: [],
    messages: [
      {
        id: "m_401",
        sender: "patient",
        senderName: "Sarah Miller",
        text: "Saw your Instagram reel on Cardiac Calcium Scoring! Do you have a senior citizen master health checkup package that includes Echo & Calcium Scoring for my parents?",
        timestamp: "Today, 09:40 AM",
        channel: "instagram",
      },
      {
        id: "m_402",
        sender: "agent",
        senderName: "Vikram Mehta",
        text: "Hello Sarah! Yes, our 'Platinum Senior Care Package' includes 320-slice CT Calcium scoring, 2D Echo, TMT, complete blood profile, and Geriatric Physician review. I will send you the PDF brochure.",
        timestamp: "Today, 09:50 AM",
        channel: "instagram",
        seen: true,
      },
    ],
  },
  {
    id: "conv_5",
    patientName: "Dr. Arvind Swamy",
    uhid: "UHID-10612",
    phone: "+91 98450 11223",
    email: "dr.arvind.swamy@mysorecardiac.org",
    channel: "linkedin",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    age: 58,
    gender: "Male",
    city: "Mysuru",
    preferredLanguage: "English",
    department: "Cardiovascular Surgery",
    leadSource: "LinkedIn InMail",
    leadStatus: "Urgent Admission",
    priority: "Urgent",
    status: "open",
    assignedTo: "staff_1", // Dr. Rajesh Sharma
    starred: true,
    lastActivity: "2 hr ago",
    unreadCount: 0,
    topic: "Emergency Referral: Type A Acute Aortic Dissection",
    appointment: {
      status: "Emergency CCU Bed Reserved",
      date: "Today, Expected 03:00 PM Ambulance",
      doctor: "Dr. Rajesh Sharma, MD",
      department: "Cardiothoracic OT 3",
      type: "Surgical Transfer",
    },
    todos: [
      { id: "todo_5", title: "Reserve 4 units O-negative blood from central blood bank", tag: "Emergency", status: "In Progress", assignee: "Dr. Rajesh Sharma" },
      { id: "todo_6", title: "Alert Cath lab and surgical perfusionist on duty", tag: "OT Alert", status: "To Do", assignee: "Priya Nair" },
    ],
    messages: [
      {
        id: "m_501",
        sender: "patient",
        senderName: "Dr. Arvind Swamy",
        text: "Dr. Sharma, transferring Mr. Ramesh Rao (62M) with acute Stanford Type A dissection. Dispatched via advanced cardiac ambulance with IV labetalol infusion. ETA Bengaluru 03:15 PM.",
        timestamp: "Today, 09:10 AM",
        channel: "linkedin",
      },
      {
        id: "m_502",
        sender: "agent",
        senderName: "Dr. Rajesh Sharma",
        text: "Thank you Dr. Arvind. CCU Bed 04 and OT 3 are prepped. Transesophageal Echo team is on standby. Please keep us updated on vitals en route.",
        timestamp: "Today, 09:14 AM",
        channel: "linkedin",
        seen: true,
      },
    ],
  },
  {
    id: "conv_6",
    patientName: "John Smith",
    uhid: "UHID-10544",
    phone: "+91 97312 99014",
    email: "john.smith@acme.com",
    channel: "messenger",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face",
    age: 39,
    gender: "Male",
    city: "Bengaluru",
    preferredLanguage: "English",
    department: "Orthopedics & Physiotherapy",
    leadSource: "Facebook Messenger",
    leadStatus: "Contacted",
    priority: "Medium",
    status: "open",
    assignedTo: "staff_4",
    starred: false,
    lastActivity: "3 hr ago",
    unreadCount: 0,
    topic: "Post-op Home Physiotherapy visit inquiries",
    appointment: null,
    todos: [],
    messages: [
      {
        id: "m_601",
        sender: "patient",
        senderName: "John Smith",
        text: "Hello! My father underwent total knee replacement last week. Do you provide certified physiotherapists for home rehabilitation visits in Whitefield?",
        timestamp: "Today, 08:30 AM",
        channel: "messenger",
      },
      {
        id: "m_602",
        sender: "agent",
        senderName: "Vikram Mehta",
        text: "Hi John, yes! Our Apple HomeCare team covers Whitefield with trained neuro-ortho physiotherapists. The package includes 10 home sessions and ROM monitoring.",
        timestamp: "Today, 08:42 AM",
        channel: "messenger",
        seen: true,
      },
    ],
  },
  {
    id: "conv_7",
    patientName: "Alexander Wright",
    uhid: "UHID-10589",
    phone: "+91 99800 11456",
    email: "a.wright@globallogistics.co.uk",
    channel: "threads",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    age: 48,
    gender: "Male",
    city: "Bengaluru / Expat",
    preferredLanguage: "English",
    department: "Executive Health & Travel Clinic",
    leadSource: "Threads Mention",
    leadStatus: "New Lead",
    priority: "Urgent",
    status: "open",
    assignedTo: null,
    starred: false,
    lastActivity: "Yesterday",
    unreadCount: 1,
    topic: "Yellow Fever & Typhoid Vaccine Certification for International Travel",
    appointment: null,
    todos: [],
    messages: [
      {
        id: "m_701",
        sender: "patient",
        senderName: "Alexander Wright",
        text: "Hi there, I am travelling to East Africa next Monday and urgently need Yellow Fever vaccination and WHO international yellow card. Are walk-ins permitted tomorrow morning?",
        timestamp: "Yesterday, 06:15 PM",
        channel: "threads",
      },
    ],
  },
  {
    id: "conv_8",
    patientName: "Anna Johnson",
    uhid: "UHID-10640",
    phone: "+91 98455 33211",
    email: "anna.j@fintech.in",
    channel: "whatsapp",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    age: 31,
    gender: "Female",
    city: "Bengaluru",
    preferredLanguage: "English",
    department: "Billing & Insurance TPA",
    leadSource: "WhatsApp Direct",
    leadStatus: "Closed / Resolved",
    priority: "Low",
    status: "resolved",
    assignedTo: "staff_5",
    starred: false,
    lastActivity: "Yesterday",
    unreadCount: 0,
    topic: "Finalized Discharge Summary & Tax Invoice for Reimbursement",
    appointment: null,
    todos: [],
    messages: [
      {
        id: "m_801",
        sender: "patient",
        senderName: "Anna Johnson",
        text: "Hello, could you please email me the stamped copy of the pharmacy bills for IPD #40291?",
        timestamp: "Yesterday, 02:10 PM",
        channel: "whatsapp",
      },
      {
        id: "m_802",
        sender: "agent",
        senderName: "Megan Chen",
        text: "Hi Anna, we have emailed the password-protected digital stamped invoice to your registered email anna.j@fintech.in. Wishing you good health!",
        timestamp: "Yesterday, 02:25 PM",
        channel: "whatsapp",
        seen: true,
      },
    ],
  },
];

export const CRM_METRICS = {
  totalLeads: 1248,
  activeInboundConversations: 18,
  avgFirstResponseTime: "1m 42s",
  resolutionRate: "94.2%",
  csatScore: "4.8 / 5.0",
  channelBreakdown: [
    { channel: "WhatsApp", count: 684, percent: 54.8, color: "#25D366" },
    { channel: "Webchat", count: 242, percent: 19.4, color: "#0d9488" },
    { channel: "Instagram", count: 118, percent: 9.5, color: "#E1306C" },
    { channel: "Messenger", count: 86, percent: 6.9, color: "#0084FF" },
    { channel: "Email", count: 62, percent: 5.0, color: "#6366f1" },
    { channel: "LinkedIn", count: 34, percent: 2.7, color: "#0A66C2" },
    { channel: "Threads", count: 22, percent: 1.7, color: "#000000" },
  ],
  leadFunnel: [
    { stage: "Total Inbound Leads", count: 1248, rate: "100%" },
    { stage: "Initial Triage & Contacted", count: 1162, rate: "93.1%" },
    { stage: "Clinical Consultation Booked", count: 846, rate: "67.8%" },
    { stage: "OPD/IPD Checked-in", count: 712, rate: "57.0%" },
    { stage: "Treatment & Retention", count: 688, rate: "55.1%" },
  ],
  recentAutomations: [
    { id: "auto_1", trigger: "WhatsApp Inbound ('Emergency' or 'Chest pain')", action: "Auto-escalate to Cardiac ER Desk & notify on-call ER Registrar", hits: 42, active: true },
    { id: "auto_2", trigger: "After-Hours Inbound (08:00 PM - 07:00 AM)", action: "Deploy AI Healthcare Bot with smart slot booker & ambulance hotline", hits: 318, active: true },
    { id: "auto_3", trigger: "Lab Report Generated in LIS", action: "Push WhatsApp PDF Link & dietary instructions automatically", hits: 512, active: true },
    { id: "auto_4", trigger: "Post-Discharge 48-Hour Check", action: "Trigger automated recovery survey and WhatsApp follow-up reminder", hits: 184, active: true },
  ],
};


export const CONNECTED_CHANNELS_STATUS = [
  { id: 'whatsapp', name: 'WhatsApp Business API', connected: true, account: '+91 80 4400 2200 (Verified Green Badge)', dailyVolume: '684' },
  { id: 'webchat', name: 'Live Website Chatbot', connected: true, account: 'widget.hospital.health (v2.4 CDN)', dailyVolume: '242' },
  { id: 'messenger', name: 'Meta Facebook Messenger', connected: true, account: 'fb.com/CityGeneralHospital', dailyVolume: '86' },
  { id: 'instagram', name: 'Instagram Direct (DMs)', connected: true, account: '@citygeneral_hospital', dailyVolume: '118' },
  { id: 'threads', name: 'Threads Healthcare Community', connected: true, account: '@citygeneral_hospital/threads', dailyVolume: '22' },
  { id: 'linkedin', name: 'LinkedIn Hospital Page', connected: true, account: 'linkedin.com/company/citygeneral', dailyVolume: '34' },
  { id: 'email', name: 'Hospital Care Email (IMAP/SMTP)', connected: true, account: 'care@citygeneralhospital.org', dailyVolume: '62' },
];


// Random Omnichannel Conversation Generator for Unified Inbox
const RANDOM_PATIENT_NAMES = [
  { name: "Anita Verma", gender: "Female", age: 29, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { name: "Vikram Singh", gender: "Male", age: 48, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { name: "Pooja Nair", gender: "Female", age: 34, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
  { name: "Rajesh Patel", gender: "Male", age: 52, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Meera Kulkarni", gender: "Female", age: 41, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  { name: "Kavita Joshi", gender: "Female", age: 26, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { name: "Amit Saxena", gender: "Male", age: 38, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
  { name: "Sunita Devi", gender: "Female", age: 62, avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&h=100&fit=crop&crop=face" },
  { name: "Rohan Gupta", gender: "Male", age: 31, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Sarah Jenkins", gender: "Female", age: 45, avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop&crop=face" },
  { name: "Naveen Reddy", gender: "Male", age: 36, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
  { name: "Lakshmi Prasanna", gender: "Female", age: 33, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face" },
  { name: "Karthik Iyer", gender: "Male", age: 44, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face" },
  { name: "Bhavna Shah", gender: "Female", age: 50, avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
];

const CLINICAL_SCENARIOS = [
  {
    department: "Cardiology",
    topic: "Follow-up for post-stent cardiac rehabilitation & ECG query",
    patientMsg: "Hello, my father had a stent placed 3 weeks ago. He is feeling slight palpitations when climbing stairs. Should we bring him in today?",
    note: "NOTE: Checked EHR history (UHID-88392). Dr. Rajesh Sharma recommends checking SpO2 & BP. Advised emergency walk-in if accompanied by sweating.",
    agentReply: "Hello, we take heart palpitations seriously. Please check his blood pressure if you have a monitor at home. Dr. Rajesh Sharma has an available OPD slot today at 11:30 AM in Room 104, or you can come directly to our Triage desk.",
    leadSource: "WhatsApp Direct",
    leadStatus: "OPD Booked",
    priority: "Urgent"
  },
  {
    department: "Obstetrics & Gynaecology",
    topic: "2nd Trimester anomaly scan booking & fasting guidelines",
    patientMsg: "Hi, I need to book my 22-week fetal anomaly ultrasound with Dr. Sunita Rao. Do I need to be fasting for this scan?",
    note: "NOTE: Level II anomaly scan does not require fasting. Keep bladder moderately full. Allotted slot with Dr. Rao.",
    agentReply: "Namaste! For the 22-week Level II anomaly ultrasound, fasting is not required. You may have light food. Please drink 2-3 glasses of water 45 minutes prior so the bladder is moderately filled. We have a slot tomorrow at 10:15 AM.",
    leadSource: "Instagram DM",
    leadStatus: "Qualified Patient",
    priority: "Normal"
  },
  {
    department: "Pediatrics",
    topic: "Child high fever (102°F) and vaccine schedule guidance",
    patientMsg: "Good morning, my 3-year-old son has a temperature of 102°F since 2 AM. He took Paracetamol syrup but fever returned. Can we consult a pediatrician immediately?",
    note: "NOTE: Priority triage assigned. Informed triage nurse Megan Chen to prep pediatric nebulizer & cold compress if required.",
    agentReply: "Hello, please do not worry. Keep a damp lukewarm washcloth on his forehead. Dr. Kavita Joshi is on duty right now in the Pediatric OPD Wing (Room 108). You can walk in immediately without waiting.",
    leadSource: "Website Live Chat",
    leadStatus: "In Consultation",
    priority: "Urgent"
  },
  {
    department: "Orthopedics",
    topic: "Knee replacement second opinion & cashless TPA insurance inquiry",
    patientMsg: "Hello, my mother was advised Total Knee Replacement by a local clinic. We want a second opinion from Dr. Vivek Anand and want to know if Star Health cashless insurance is accepted.",
    note: "NOTE: Sent TPA pre-authorization checklist. Star Health cashless is active on Ground Floor Counter 6.",
    agentReply: "Hello! Yes, Apple Hospital has direct cashless tie-up with Star Health Insurance. Dr. Vivek Anand (Senior Orthopedic Surgeon) has second-opinion slots available on Thursday at 02:30 PM. Please bring her knee X-rays and MRI films.",
    leadSource: "Messenger",
    leadStatus: "Contacted",
    priority: "High"
  },
  {
    department: "Neurology",
    topic: "Chronic migraine with visual aura & MRI brain review",
    patientMsg: "Dear care team, I have been getting severe throbbing headaches on the right side with blurry vision. My doctor suggested an MRI Brain. Do you have same-day MRI slots?",
    note: "NOTE: 3T MRI Brain slot blocked for 03:00 PM. Verified non-contrast protocol.",
    agentReply: "Hello, yes! Our 3.0 Tesla MRI suite has an open slot today at 03:00 PM with instant digital report generation. Dr. Anand Verma (DM Neurology) will review the scan right after at 04:30 PM.",
    leadSource: "Email Outreach",
    leadStatus: "Qualified Patient",
    priority: "High"
  },
  {
    department: "General Medicine",
    topic: "Executive Master Health Checkup package inquiry",
    patientMsg: "Hi, I am looking for a comprehensive full-body preventive health package for myself and my spouse before traveling abroad. What does the Platinum package cover?",
    note: "NOTE: Dispatched Health Package PDF brochure via WhatsApp. Fasting guidelines sent.",
    agentReply: "Hello! Our Platinum Master Health Checkup covers 84 parameters including Complete Blood Count, Liver & Kidney Function, Lipid Panel, HbA1c, Vitamin D3/B12, Cardiac Stress Test (TMT), Ultrasound Abdomen, and Physician consult. Special package price is ₹4,999 per person.",
    leadSource: "LinkedIn Inbound",
    leadStatus: "New Lead",
    priority: "Normal"
  },
  {
    department: "Billing & Insurance TPA",
    topic: "Discharge summary & itemized pharmacy tax invoice request",
    patientMsg: "Hi, could you please email me the stamped copy of the pharmacy bills for IPD #40291? My corporate HR needs it for medical reimbursement.",
    note: "NOTE: Digital stamped copy retrieved from SAP LIS. Emailed to patient registered email.",
    agentReply: "Hi! We have dispatched the password-protected, digitally stamped invoice and pharmacy breakdown to your registered email address. Wishing you continued good health!",
    leadSource: "WhatsApp Direct",
    leadStatus: "Closed / Resolved",
    priority: "Low"
  }
];

const AVAILABLE_CHANNELS = ["whatsapp", "messenger", "instagram", "threads", "linkedin", "webchat", "email"];

export function generateRandomConversations(count = 10) {
  const generated = [];
  const shuffledPatients = [...RANDOM_PATIENT_NAMES].sort(() => 0.5 - Math.random());

  for (let i = 0; i < Math.min(count, shuffledPatients.length); i++) {
    const patient = shuffledPatients[i];
    const scenario = CLINICAL_SCENARIOS[Math.floor(Math.random() * CLINICAL_SCENARIOS.length)];
    const channel = AVAILABLE_CHANNELS[Math.floor(Math.random() * AVAILABLE_CHANNELS.length)];
    const isUnread = Math.random() > 0.45;
    const isStarred = Math.random() > 0.65;
    const randomMinutes = Math.floor(Math.random() * 45) + 1;
    const uhidNum = Math.floor(10000 + Math.random() * 90000);
    const phoneNum = `+91 ${Math.floor(90000 + Math.random() * 9999)} ${Math.floor(10000 + Math.random() * 89999)}`;

    generated.push({
      id: `rand_conv_${Date.now()}_${i}`,
      patientName: patient.name,
      uhid: `UHID-${uhidNum}`,
      phone: phoneNum,
      email: `${patient.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      channel: channel,
      avatar: patient.avatar,
      age: patient.age,
      gender: patient.gender,
      city: "Bengaluru",
      preferredLanguage: Math.random() > 0.5 ? "English" : "Telugu / English",
      department: scenario.department,
      leadSource: scenario.leadSource,
      leadStatus: scenario.leadStatus,
      priority: scenario.priority,
      status: Math.random() > 0.3 ? "open" : "resolved",
      assignedTo: "staff_2", // Priya Nair (Agent)
      starred: isStarred,
      lastActivity: `${randomMinutes}m ago`,
      unreadCount: isUnread ? Math.floor(Math.random() * 3) + 1 : 0,
      topic: scenario.topic,
      appointment: {
        status: "Scheduled",
        date: "Today, " + (Math.floor(Math.random() * 4) + 10) + ":30 AM",
        doctor: "Dr. Rajesh Sharma, MD",
        department: scenario.department + " Desk",
        type: "In-Person Consultation",
      },
      todos: [
        { id: `todo_${i}_1`, title: "Verify insurance cashless pre-auth status", tag: "TPA", status: "In Progress", assignee: "Priya Nair" },
        { id: `todo_${i}_2`, title: "Send WhatsApp fasting instructions 24h prior", tag: "WhatsApp", status: "To Do", assignee: "Priya Nair" },
      ],
      messages: [
        {
          id: `msg_${i}_1`,
          sender: "patient",
          senderName: patient.name,
          text: scenario.patientMsg,
          timestamp: `${randomMinutes + 6}m ago`,
          channel: channel,
        },
        {
          id: `msg_${i}_note`,
          sender: "note",
          senderName: "Priya Nair (Agent Note)",
          text: scenario.note,
          timestamp: `${randomMinutes + 4}m ago`,
          isPrivateNote: true,
        },
        {
          id: `msg_${i}_2`,
          sender: "agent",
          senderName: "Priya Nair",
          text: scenario.agentReply,
          timestamp: `${randomMinutes}m ago`,
          channel: channel,
          seen: true,
        }
      ]
    });
  }

  return generated;
}
