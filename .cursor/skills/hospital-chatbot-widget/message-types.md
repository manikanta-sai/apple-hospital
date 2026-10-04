# Message types reference

## Doctor object (cards)

```json
{
  "id": "doc_101",
  "name": "Dr. Ananya Rao",
  "department": "Cardiology",
  "image": "https://...",
  "availability": "available" | "busy",
  "nextSlot": "Today, 4:30 PM",
  "rating": 4.8,
  "slots": ["9:00 AM", "11:30 AM"]
}
```

`DoctorCardList` / `DoctorCard` render `doctor-list` and `fallback`. Fallback uses amber lead-in styling (same rail, different tone).

## Mock keyword routing (`pickMockReply`)

| User text contains | Mock export |
|-------------------|-------------|
| `mani` | `mockUnavailableFallback` |
| `cardio`, `heart` | `mockCardiologySearch` |
| `ortho`, `bone`, `joint` | `mockOrthopedicsSearch` |
| `pediatr`, `child`, `kid` | `mockPediatricsSearch` |
| `doctor`, `specialist`, `physician`, `see a doctor`, `all` | `mockAllDoctorsSearch` |
| `enquiry`, `enquire` | `mockEnquiryReply` |
| `address`, `location` | `mockAddressReply` |
| `agent`, `human` | `mockLiveAgentReply` |
| (default) | `mockPlainTextReply` — includes **Timings** |

## Client-only message fields

| type | Extra fields | Component |
|------|--------------|-----------|
| `patient-form` | `status`: `pending` \| `submitted`, `formData?` | `PatientRegistrationForm.jsx` |
| `slot-picker` | `doctor`, `slots[]`, `selectedSlot` | `SlotPicker.jsx` |
| `booking-success` | `doctor`, `slot` | `BookingConfirmation.jsx` |
| user `text` | `attachments?` | `MessageBubble.jsx` / composer |

## Attachments

- Composer: `AttachmentComposer.jsx` (max 4 files, 5MB, jpeg/png/webp/pdf)
- Upload: `uploadChatAttachments()` in `chatApi.js`; mock simulates progress
- Send pipeline: `sendMessage(text, attachments)` includes attachment metadata in POST body when not in mock

## Proactive trigger

`useBehavioralTrigger` returns `{ trigger, dismiss, accept }`. Accept typically opens chat and calls `injectAssistantMessage` or sends `quickAction` via `sendMessage` — follow existing `ChatWidget.jsx` wiring when changing behavior.
