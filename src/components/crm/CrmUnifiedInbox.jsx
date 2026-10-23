import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Settings,
  Plus,
  Send,
  Sparkles,
  Paperclip,
  Image,
  Smile,
  Bookmark,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  AlignLeft,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  Share2,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Star,
  CheckCheck,
  Shield,
  FileText,
  CreditCard,
  MessageSquare,
  ArrowRight,
  X,
  ThumbsDown,
} from "lucide-react";
import ChannelIcon from "./ChannelIcon";
import { CHANNELS, STAFF_MEMBERS, QUICK_REPLIES, INITIAL_CONVERSATIONS, generateRandomConversations } from "./crmMockData";

export default function CrmUnifiedInbox({
  conversations = [],
  targetConversationId = null,
  agentProfile = null,
  onUpdateConversation = () => {},
  onSelectPatientForBooking = () => {},
}) {
  const currentAgent = agentProfile || {
    name: "Priya Nair, MHA",
    role: "Senior Patient Care Coordinator & Omnichannel Lead",
    agentId: "AGENT-704",
  };

  const [conversationsList, setConversationsList] = useState(() => {
    return conversations?.length > 0 ? conversations : INITIAL_CONVERSATIONS;
  });

  const [toastMessage, setToastMessage] = useState(null);

  const [selectedConvId, setSelectedConvId] = useState(() => {
    return targetConversationId || (conversations?.length > 0 ? conversations[0]?.id : INITIAL_CONVERSATIONS[0]?.id) || "conv_1";
  });

  useEffect(() => {
    if (targetConversationId) {
      setSelectedConvId(targetConversationId);
    }
  }, [targetConversationId]);

  const handleRandomizeData = () => {
    const fresh = generateRandomConversations(10);
    setConversationsList(fresh);
    if (fresh.length > 0) {
      setSelectedConvId(fresh[0].id);
    }
    setToastMessage("🎲 Generated 10 fresh patient conversations with real clinical queries!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [statusFilter, setStatusFilter] = useState("open"); // "open" | "resolved" | "all"
  const [folderFilter, setFolderFilter] = useState("all"); // "unassigned" | "assigned_me" | "all" | "starred"
  const [channelFilter, setChannelFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Composer State
  const [composerMode, setComposerMode] = useState("reply"); // "reply" | "notes"
  const [messageText, setMessageText] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Right sidebar tabs & accordion states
  const [rightTab, setRightTab] = useState("details"); // "details" | "activity"
  const [accordions, setAccordions] = useState({
    contact: true,
    clinical: true,
    actions: true,
    appointments: true,
    todos: true,
  });

  // New To-Do Form State
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [showAddTodo, setShowAddTodo] = useState(false);

  // Scroll to bottom of message stream
  const messagesEndRef = useRef(null);

  const selectedConversation = useMemo(() => {
    return conversationsList.find((c) => c.id === selectedConvId) || conversationsList[0] || null;
  }, [conversationsList, selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // Filtered Conversations List
  const filteredConversations = useMemo(() => {
    return conversationsList.filter((c) => {
      // 1. Status Filter
      if (statusFilter !== "all" && c.status !== statusFilter) return false;

      // 2. Folder Filter
      if (folderFilter === "unassigned" && c.assignedTo) return false;
      if (folderFilter === "assigned_me" && c.assignedTo !== "staff_2" && c.assignedTo !== "staff_5") return false;
      if (folderFilter === "starred" && !c.starred) return false;

      // 3. Channel Filter
      if (channelFilter !== "all" && c.channel !== channelFilter) return false;

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.patientName?.toLowerCase().includes(q);
        const matchUhid = c.uhid?.toLowerCase().includes(q);
        const matchPhone = c.phone?.includes(q);
        const matchTopic = c.topic?.toLowerCase().includes(q);
        const matchMsg = c.messages?.some((m) => m.text?.toLowerCase().includes(q));
        if (!matchName && !matchUhid && !matchPhone && !matchTopic && !matchMsg) return false;
      }

      return true;
    });
  }, [conversationsList, statusFilter, folderFilter, channelFilter, searchQuery]);

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendMessage = (resolve = false) => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: "m_" + Date.now(),
      sender: composerMode === "notes" ? "note" : "agent",
      senderName: composerMode === "notes" ? `${currentAgent.name} (Internal Note)` : currentAgent.name,
      text: messageText.trim(),
      timestamp: "Just now",
      channel: composerMode === "notes" ? "internal_note" : selectedConversation.channel,
      seen: false,
    };

    const updated = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      status: resolve ? "resolved" : selectedConversation.status,
      lastActivity: "Just now",
    };

    setConversationsList(prev => prev.map(c => c.id === updated.id ? updated : c));
    onUpdateConversation(updated);
    setMessageText("");
    setShowQuickReplies(false);
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim() || !selectedConversation) return;
    const newTodo = {
      id: "todo_" + Date.now(),
      title: newTodoTitle.trim(),
      tag: "Follow-up",
      status: "To Do",
      assignee: currentAgent.name,
    };
    const updated = {
      ...selectedConversation,
      todos: [...(selectedConversation.todos || []), newTodo],
    };
    setConversationsList(prev => prev.map(c => c.id === updated.id ? updated : c));
    onUpdateConversation(updated);
    setNewTodoTitle("");
    setShowAddTodo(false);
  };

  const handleToggleTodoStatus = (todoId) => {
    if (!selectedConversation) return;
    const updatedTodos = (selectedConversation.todos || []).map((t) => {
      if (t.id === todoId) {
        return {
          ...t,
          status: t.status === "In Progress" ? "Done" : t.status === "To Do" ? "In Progress" : "To Do",
        };
      }
      return t;
    });
    const updated = { ...selectedConversation, todos: updatedTodos };
    setConversationsList(prev => prev.map(c => c.id === updated.id ? updated : c));
    onUpdateConversation(updated);
  };

  const handleGenerateAiResponse = () => {
    if (!selectedConversation) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      let draft = "";
      if (selectedConversation.department === "Cardiology") {
        draft = "Hello, thank you for reaching out. Dr. Rajesh Sharma has availability tomorrow at 10:30 AM in OPD Room 104. Would you like me to reserve this priority consultation slot for you?";
      } else if (selectedConversation.department?.includes("Obstetrics")) {
        draft = "Hello Anita ji, we have notified Dr. Sunita Rao. Please report to Triage Counter 2 on arrival; a wheelchair and nurse coordinator have been arranged to assist you immediately.";
      } else {
        draft = "Thank you for contacting ABCD Multispecialty Hospital. We have received your query and our clinical care coordinator is reviewing your details to provide immediate assistance.";
      }
      setMessageText(draft);
      setIsAiGenerating(false);
    }, 600);
  };

  const assignedStaff = useMemo(() => {
    return STAFF_MEMBERS.find((s) => s.id === selectedConversation?.assignedTo) || null;
  }, [selectedConversation?.assignedTo]);

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100 font-sans border border-slate-200/90 rounded-2xl shadow-sm h-full relative">
      {/* Toast Alert for Randomization */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <span className="text-amber-400">⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── PANEL 1: CONVERSATION LIST (LEFT, 320px) ── */}
      <div className="w-80 md:w-88 xl:w-96 bg-white border-r border-slate-200/80 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <span>Inbox</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {conversationsList.length}
              </span>
            </h2>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRandomizeData}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                title="Generate 10 randomized real-world patient conversations across 7 channels"
              >
                <span>🎲</span>
                <span>Randomize</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const demoName = prompt("Enter Patient Name for New Inbound Message:", "Kavita Reddy");
                  if (demoName) {
                    alert(`Simulated inbound webchat initiated from ${demoName}!`);
                  }
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                title="Simulate inbound message"
              >
                + Try chat
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <Search size={14} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all conversations..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 p-0.5">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Open / Resolved Status Tabs */}
          <div className="flex items-center border-b border-slate-100 -mb-3.5 pt-1">
            {[
              { id: "open", label: "Open" },
              { id: "resolved", label: "Resolved" },
              { id: "all", label: "All Status" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex-1 pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                  statusFilter === tab.id
                    ? "text-slate-900 font-extrabold"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {statusFilter === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Folders & Channel Filter Pills */}
        <div className="p-2.5 bg-slate-50/70 border-b border-slate-100 space-y-2">
          {/* Folders */}
          <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setFolderFilter("all")}
              className={`px-2 py-1 rounded-lg text-center cursor-pointer transition-all ${
                folderFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({conversationsList.length})
            </button>
            <button
              type="button"
              onClick={() => setFolderFilter("assigned_me")}
              className={`px-2 py-1 rounded-lg text-center cursor-pointer transition-all ${
                folderFilter === "assigned_me" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mine ({conversationsList.filter((c) => c.assignedTo === "staff_2" || c.assignedTo === "staff_5").length})
            </button>
            <button
              type="button"
              onClick={() => setFolderFilter("unassigned")}
              className={`px-2 py-1 rounded-lg text-center cursor-pointer transition-all ${
                folderFilter === "unassigned" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unassigned ({conversationsList.filter((c) => !c.assignedTo).length})
            </button>
          </div>

          {/* Channel Pills (Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
            {CHANNELS.map((ch) => {
              const active = channelFilter === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChannelFilter(ch.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-all cursor-pointer border ${
                    active
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200/90 hover:bg-slate-100"
                  }`}
                >
                  {ch.id !== "all" && <ChannelIcon channel={ch.id} size={11} />}
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 kanban-scrollbar">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              const lastMsg = conv.messages?.[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer select-none ${
                    isSelected ? "bg-slate-100/90 border-l-4 border-l-slate-900" : "hover:bg-slate-50/90"
                  }`}
                >
                  {/* Avatar with Channel Icon Badge */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.patientName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200/80"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs border border-slate-200">
                      <ChannelIcon channel={conv.channel} size={11} />
                    </div>
                  </div>

                  {/* Conversation Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <strong className="text-xs font-bold text-slate-900 truncate">
                        {conv.patientName}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {conv.lastActivity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 font-medium mb-1">
                      {lastMsg?.text || conv.topic}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                        {conv.department}
                      </span>
                      {conv.priority === "Urgent" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Urgent
                        </span>
                      )}
                      {conv.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-bold text-slate-700">No conversations found</p>
              <p className="text-[11px] text-slate-500">Try changing status or channel filter</p>
            </div>
          )}
        </div>
      </div>

      {/* ── PANEL 2: CENTER CHAT WINDOW & RICH COMPOSER (FLEX-1) ── */}
      <div className="flex-1 bg-white flex flex-col min-w-0 border-r border-slate-200/80">
        {selectedConversation ? (
          <>
            {/* Chat Header Bar */}
            <div className="p-3.5 px-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2.5 bg-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.patientName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs border border-slate-200">
                    <ChannelIcon channel={selectedConversation.channel} size={12} />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm text-slate-900 truncate">
                      {selectedConversation.patientName}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-600">
                      {selectedConversation.uhid}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {selectedConversation.channel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {selectedConversation.topic}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Assign, Transfer, Resolve */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = selectedConversation.assignedTo === "staff_5" ? null : "staff_5";
                    onUpdateConversation({ ...selectedConversation, assignedTo: next });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedConversation.assignedTo === "staff_5"
                      ? "bg-teal-50 text-teal-800 border-teal-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  <UserCheck size={13} />
                  <span>{selectedConversation.assignedTo === "staff_5" ? "Assigned to You" : "Assign to me"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const isRes = selectedConversation.status === "resolved";
                    onUpdateConversation({
                      ...selectedConversation,
                      status: isRes ? "open" : "resolved",
                    });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedConversation.status === "resolved"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>{selectedConversation.status === "resolved" ? "Resolved ✓" : "Mark Resolved"}</span>
                </button>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 kanban-scrollbar bg-slate-50/40">
              {/* Date Header Tag */}
              <div className="flex items-center justify-center">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-500 border border-slate-200 shadow-2xs">
                  Today
                </span>
              </div>

              {selectedConversation.messages?.map((msg) => {
                // Internal Note View (Yellow Tint Card matching reference mockup)
                if (msg.sender === "note") {
                  return (
                    <div
                      key={msg.id}
                      className="mx-auto max-w-2xl bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>Internal Clinical / Staff Note</span>
                        </span>
                        <span className="text-[10px] text-amber-700/80">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-amber-950 font-medium whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold block pt-1">
                        — {msg.senderName}
                      </span>
                    </div>
                  );
                }

                // Incoming Patient Message Bubble
                if (msg.sender === "patient") {
                  return (
                    <div key={msg.id} className="flex items-start gap-3 max-w-xl">
                      <img
                        src={selectedConversation.avatar}
                        alt={selectedConversation.patientName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                      />
                      <div className="space-y-1">
                        <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-3.5 shadow-2xs text-slate-800 text-xs font-normal whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-2 pl-1 text-[10px] text-slate-400">
                          <ChannelIcon channel={msg.channel || selectedConversation.channel} size={11} />
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Outgoing Staff / Agent Message Bubble (Right-aligned, matching Intercom reference)
                return (
                  <div key={msg.id} className="flex items-start justify-end gap-3 max-w-2xl ml-auto">
                    <div className="space-y-1 text-right">
                      <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tr-sm p-4 shadow-2xs text-slate-800 text-xs font-normal whitespace-pre-wrap leading-relaxed text-left">
                        {msg.text}
                      </div>
                      <div className="flex items-center justify-end gap-2 pr-1 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {msg.seen && (
                          <span className="flex items-center gap-0.5 text-teal-600 font-bold">
                            <CheckCheck size={12} />
                            <span>Seen</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <img
                      src={
                        assignedStaff?.avatar ||
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
                      }
                      alt="Staff"
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                    />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Rich Message Composer (Directly inspired by Intercom UI) */}
            <div
              className={`p-3 sm:p-4 border-t transition-colors ${
                composerMode === "notes"
                  ? "bg-amber-50/70 border-amber-300"
                  : "bg-white border-slate-200/80"
              }`}
            >
              {/* Mode Toggle & Formatting Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-200/70 mb-2.5">
                {/* Reply vs Notes Segmented Pill */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setComposerMode("reply")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      composerMode === "reply"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode("notes")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      composerMode === "notes"
                        ? "bg-amber-400 text-amber-950 shadow-2xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Notes
                  </button>
                </div>

                {/* Formatting Tools */}
                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Bold (Ctrl+B)"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Italic (Ctrl+I)"
                  >
                    <Italic size={13} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Underline (Ctrl+U)"
                  >
                    <Underline size={13} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Insert Link"
                  >
                    <Link2 size={13} />
                  </button>
                  <div className="h-4 w-px bg-slate-200 mx-1" />
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Bullet List"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Attach Image"
                  >
                    <Image size={13} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Attach Clinical Document"
                  >
                    <Paperclip size={13} />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Emoji"
                  >
                    <Smile size={13} />
                  </button>
                </div>
              </div>

              {/* Textarea Input */}
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSendMessage(false);
                  }
                }}
                rows={3}
                placeholder={
                  composerMode === "notes"
                    ? "Add internal private note visible only to hospital staff..."
                    : `Reply to ${selectedConversation.patientName} via ${selectedConversation.channel}... (Ctrl+Enter to send)`
                }
                className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
              />

              {/* Quick Replies Dropdown / Drawer */}
              {showQuickReplies && (
                <div className="p-2.5 mb-2 rounded-xl bg-white border border-slate-200 shadow-lg space-y-1.5 animate-slide-up">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700">Healthcare Quick Replies</span>
                    <button onClick={() => setShowQuickReplies(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto kanban-scrollbar">
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.id}
                        type="button"
                        onClick={() => {
                          setMessageText((prev) => (prev ? `${prev}\n\n${qr.body}` : qr.body));
                          setShowQuickReplies(false);
                        }}
                        className="p-1.5 rounded-lg text-left hover:bg-slate-50 border border-slate-100 transition-colors"
                      >
                        <span className="text-[10px] font-bold text-teal-800 block">{qr.title}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{qr.body}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  {/* AI Copilot Button */}
                  <button
                    type="button"
                    onClick={handleGenerateAiResponse}
                    disabled={isAiGenerating}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all cursor-pointer flex items-center gap-1 border border-indigo-200 shadow-2xs"
                    title="Generate clinical AI response"
                  >
                    <Sparkles size={12} className={isAiGenerating ? "animate-spin" : ""} />
                    <span>{isAiGenerating ? "Generating..." : "AI Copilot"}</span>
                  </button>

                  {/* Canned Quick Replies Icon */}
                  <button
                    type="button"
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                    title="Insert canned response template"
                  >
                    <Bookmark size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendMessage(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    Send
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage(true)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send & Resolve</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
            <p className="text-sm font-bold text-slate-700">Select a conversation to view thread</p>
          </div>
        )}
      </div>

      {/* ── PANEL 3: PATIENT / LEAD 360° PROFILE & CRM DETAILS (RIGHT, 320px) ── */}
      <div className="w-80 xl:w-88 bg-white flex flex-col shrink-0 overflow-y-auto kanban-scrollbar">
        {selectedConversation ? (
          <>
            {/* Top Tabs: Details vs Activity */}
            <div className="flex items-center border-b border-slate-100 bg-white sticky top-0 z-10">
              <button
                type="button"
                onClick={() => setRightTab("details")}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                  rightTab === "details"
                    ? "border-slate-900 text-slate-900 font-extrabold"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setRightTab("activity")}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
                  rightTab === "activity"
                    ? "border-slate-900 text-slate-900 font-extrabold"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Activity Log
              </button>
            </div>

            {rightTab === "details" ? (
              <div className="p-4 space-y-4">
                {/* 1. Contact Details Accordion */}
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("contact")}
                    className="w-full p-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors"
                  >
                    <span>Contact details</span>
                    {accordions.contact ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {accordions.contact && (
                    <div className="p-3.5 space-y-2.5 text-xs text-slate-700 bg-white border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                        <a
                          href={`tel:${selectedConversation.phone}`}
                          className="font-bold text-teal-700 hover:underline flex items-center gap-1"
                        >
                          <Phone size={11} />
                          <span>{selectedConversation.phone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                        <a
                          href={`mailto:${selectedConversation.email}`}
                          className="font-medium text-slate-800 hover:underline flex items-center gap-1"
                        >
                          <Mail size={11} />
                          <span>{selectedConversation.email}</span>
                        </a>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Age / Gender</span>
                          <span className="font-bold">{selectedConversation.age}y, {selectedConversation.gender}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Location</span>
                          <span className="font-bold">{selectedConversation.city}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Clinical & Lead Status Accordion */}
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("clinical")}
                    className="w-full p-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors"
                  >
                    <span>Lead & Clinical Info</span>
                    {accordions.clinical ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {accordions.clinical && (
                    <div className="p-3.5 space-y-2.5 text-xs bg-white border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                        <span className="font-bold text-slate-800">{selectedConversation.department}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Source</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <ChannelIcon channel={selectedConversation.channel} size={11} />
                          <span>{selectedConversation.leadSource}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Lead Status</span>
                          <span className="font-bold text-teal-800">{selectedConversation.leadStatus}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Priority</span>
                          <span
                            className={`font-bold ${
                              selectedConversation.priority === "Urgent" ? "text-rose-600" : "text-amber-700"
                            }`}
                          >
                            {selectedConversation.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Custom Quick Healthcare Actions Accordion */}
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("actions")}
                    className="w-full p-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors"
                  >
                    <span>Custom actions</span>
                    {accordions.actions ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {accordions.actions && (
                    <div className="p-3 space-y-2 bg-white border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onSelectPatientForBooking(selectedConversation)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>Book OPD Appointment</span>
                        </span>
                        <ArrowRight size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          alert(`Payment Link of ₹850 generated & sent to ${selectedConversation.phone} via WhatsApp!`);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <CreditCard size={13} />
                          <span>Send Payment Link</span>
                        </span>
                        <ArrowRight size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          alert(`Pre-Consultation Fasting Instructions dispatched to ${selectedConversation.email}!`);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText size={13} />
                          <span>Send Lab Prep Advice</span>
                        </span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Related Appointments Accordion */}
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("appointments")}
                    className="w-full p-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors"
                  >
                    <span>Related Appointments</span>
                    {accordions.appointments ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {accordions.appointments && (
                    <div className="p-3 bg-white border-t border-slate-100 text-xs">
                      {selectedConversation.appointment ? (
                        <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-teal-800 uppercase">
                              {selectedConversation.appointment.status}
                            </span>
                            <span className="text-[10px] text-teal-700 font-mono font-bold">
                              {selectedConversation.appointment.date}
                            </span>
                          </div>
                          <strong className="text-xs font-bold text-slate-900 block">
                            {selectedConversation.appointment.doctor}
                          </strong>
                          <span className="text-[11px] text-slate-600 block">
                            {selectedConversation.appointment.department}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center py-3 text-slate-400">
                          <p className="text-[11px]">No active appointments scheduled</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 5. Related ToDos & Follow-ups Accordion (matching Intercom reference) */}
                <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="p-3 bg-slate-50/70 flex items-center justify-between text-xs font-bold text-slate-900">
                    <button
                      type="button"
                      onClick={() => toggleAccordion("todos")}
                      className="flex-1 flex items-center justify-between text-left"
                    >
                      <span>Related ToDos</span>
                      {accordions.todos ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTodo(true)}
                      className="ml-2 p-1 text-teal-700 hover:bg-teal-100 rounded-lg cursor-pointer"
                      title="Add task"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {accordions.todos && (
                    <div className="p-3 space-y-2 bg-white border-t border-slate-100 text-xs">
                      {showAddTodo && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mb-2 animate-slide-up">
                          <input
                            type="text"
                            value={newTodoTitle}
                            onChange={(e) => setNewTodoTitle(e.target.value)}
                            placeholder="Enter task / reminder..."
                            className="w-full bg-white p-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShowAddTodo(false)}
                              className="px-2 py-0.5 text-[11px] font-bold text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddTodo}
                              className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-900 text-white rounded-md"
                            >
                              Save Task
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedConversation.todos?.length > 0 ? (
                        selectedConversation.todos.map((todo) => (
                          <div
                            key={todo.id}
                            onClick={() => handleToggleTodoStatus(todo.id)}
                            className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-1.5 bg-white"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                                {todo.tag || "Task"}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${
                                  todo.status === "Done"
                                    ? "text-emerald-700"
                                    : todo.status === "In Progress"
                                    ? "text-amber-700"
                                    : "text-slate-500"
                                }`}
                              >
                                {todo.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 font-medium leading-snug">{todo.title}</p>
                            <span className="text-[10px] text-slate-400 block">
                              Assigned to: {todo.assignee}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 text-center py-2">No active tasks</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Activity Log Tab */
              <div className="p-4 space-y-3 text-xs">
                <div className="border-l-2 border-slate-200 pl-3 space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Today, 11:18 AM</span>
                    <strong className="text-slate-800 block">Message replied by Megan Chen</strong>
                    <span className="text-[11px] text-slate-500">Channel: {selectedConversation.channel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Today, 11:00 AM</span>
                    <strong className="text-slate-800 block">Internal clinical note logged</strong>
                    <span className="text-[11px] text-slate-500">Priya Nair (Care Coordinator)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Today, 10:45 AM</span>
                    <strong className="text-slate-800 block">Inbound query received</strong>
                    <span className="text-[11px] text-slate-500">Automated triage routing triggered</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
