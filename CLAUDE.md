# BaliLiving — Project Reference

## Stack
- **Next.js 16** (App Router), React 19, TypeScript strict
- **Supabase** — PostgreSQL + RLS + Storage + Realtime subscriptions
- **Auth** — Supabase Auth (JWT), middleware guards all `/admin/*` routes via `getUser()` (not `getSession()`)
- **AI** — Anthropic Claude (`@anthropic-ai/sdk`) — concierge chat, transfer tier advisor, villa recommendation
- **Styling** — Tailwind CSS v4, Framer Motion animations, Cormorant Garamond font
- **Email** — Resend (`lib/email.ts`) — confirmation emails on booking/contact/transfer

## Dev
```bash
npm run dev    # localhost:3000
npm run build
npm run lint
```

## Design System
| Token | Value | Usage |
|---|---|---|
| Dark bg | `#131E14` / `#1C2B1E` | Page/card backgrounds |
| Gold accent | `#C9A84C` / `#E8C96A` | CTAs, labels, borders |
| Light text | `#F5F0E8` | Body copy |
| Font | `var(--font-cormorant)` | Headings and prices |

All admin pages use `createServiceClient()` (bypasses RLS). Public pages use `createClient()`.

## Routes

### Public (`app/(public)/`)
| Route | File | Data |
|---|---|---|
| `/` | `page.tsx` | Static |
| `/villas` | `villas/VillasClient.tsx` | `fetchVillas()` from Supabase |
| `/villas/[slug]` | `villas/[slug]/VillaDetailClient.tsx` | `fetchVillaBySlug()` |
| `/booking/[slug]` | `booking/[slug]/BookingClient.tsx` | `getBlockedDates()`, `createBooking()` |
| `/transfers` | `transfers/page.tsx` | AI-powered, `createTransferRequest()` |
| `/tours` | `tours/page.tsx` | Supabase `tours` table |
| `/restaurants` | `restaurants/page.tsx` | Supabase `restaurants` table |
| `/contact` | `contact/page.tsx` | `createContactInquiry()` |
| `/over-ons` | `over-ons/page.tsx` | Static |
| `/visum` | `visum/page.tsx` | `createVisaApplication()` |

### Admin (`app/admin/`) — all protected by middleware
| Route | Purpose |
|---|---|
| `/admin` | Dashboard stats (bookings, revenue, transfers) |
| `/admin/bookings` | Booking management, confirm/reject, real-time |
| `/admin/transfers` | Transfer request management, confirm/reject, real-time |
| `/admin/villas` | Villa CRUD + media upload |
| `/admin/tours` | Tour management |
| `/admin/restaurants` | Restaurant management |
| `/admin/analytics` | Revenue analytics |
| `/admin/calendar` | Blocked-dates calendar |
| `/admin/visums` | Visa application management |

### API Routes (`app/api/`)
| Route | Model | Purpose |
|---|---|---|
| `/api/concierge` | `claude-haiku-4-5-20251001` | AI concierge chat — gathers guest profile, checks availability, creates bookings |
| `/api/transfer-recommendation` | `claude-haiku-4-5-20251001` | Recommends transfer tier (normaal/luxe/vip) |
| `/api/villa-advisor` | `claude-opus-4-6` | Matches villa to customer preferences |

## Server Actions (`lib/actions/`)
| File | Exports |
|---|---|
| `bookings.ts` | `createBooking`, `getBookings`, `updateBookingStatus` |
| `contact.ts` | `createContactInquiry` |
| `transfers.ts` | `createTransferRequest` |
| `static-transfers.ts` | Static transfer price/tier helpers |
| `transfer-requests.ts` | `updateTransferRequestStatus` |
| `tours.ts` | `getTours`, `saveTour` |
| `villas.ts` | `saveVilla`, `getBlockedDates`, `getVillaIdBySlug`, `uploadVillaMedia` |
| `villas-fetch.ts` | `fetchVillas`, `fetchVillaBySlug` |
| `reviews.ts` | `createReview`, `getVillaReviews`, `getVillaAverageRating` |
| `restaurants.ts` | `getRestaurants`, `saveRestaurant` |
| `visums.ts` | `createVisaApplication`, `getVisaApplications` |
| `admin-auth.ts` | `requireAdminUser` — throws if not authenticated |

## Components (`components/`)
| File | Type | Purpose |
|---|---|---|
| `Navbar.tsx` | Client | Fixed header, scroll-aware background |
| `Footer.tsx` | Client | Site footer |
| `ConciergeChat.tsx` | Client | Floating AI chat widget — gathers guest profile via quick reply chips, checks availability, creates bookings |
| `VillaAdvisor.tsx` | Client | 4-step AI villa recommendation form |
| `VillaReviews.tsx` | Client | Reviews display + submit form |
| `villa/` | — | Villa detail sub-components |
| `admin/MediaUploader.tsx` | Client | Villa image/video upload UI |

## Supabase Tables
| Table | Key Columns |
|---|---|
| `villas` | `slug` (unique), `name`, `region`, `price_per_night`, `amenities[]`, `published` |
| `villa_media` | `villa_id`, `url`, `type` (photo/video), `sort_order` |
| `blocked_dates` | `villa_id`, `blocked_date` |
| `bookings` | `villa_id`, `guest_*`, `check_in`, `check_out`, `total_price`, `status` (pending/accepted/rejected/cancelled) |
| `tours` | `name`, `price_per_person`, `duration_hours`, `max_guests`, `published` |
| `transfers` | `name`, `from/to_location`, `price`, `vehicle_type` — legacy admin templates |
| `transfer_requests` | `from/to_location`, `passengers`, `tier`, `guest_*`, `ai_recommendation`, `price_quoted`, `price_type`, `status` |
| `restaurants` | `name`, `location`, `cuisine`, `price_range`, `published` |
| `contact_inquiries` | `naam`, `email`, `interesse`, `bericht`, `status` (new/read/replied) |
| `villa_reviews` | `villa_id`, `booking_id`, `reviewer_name`, `reviewer_email`, `rating` (1-5), `review_text`, `published` |
| `admin_devices` | `push_token` — Expo push notification tokens |
| `visa_applications` | `applicant_*`, `travel_date`, `num_travelers`, `status` |

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
RESEND_API_KEY
```

## Patterns to Follow
- Server components fetch data, pass to `*Client.tsx` client components
- Server actions use `"use server"` and validate inputs before DB writes
- Admin actions call `requireAdminUser()` as the first line
- Static villa data in `lib/villas-data.ts` is a fallback when Supabase returns empty
- All admin pages: `export const dynamic = "force-dynamic"`
- RLS: public tables allow anonymous INSERT; SELECT/UPDATE requires `auth.role() = 'authenticated'`
- Push notifications on new bookings: see `lib/actions/bookings.ts` for the Expo push pattern
- Email sends must be awaited (not fire-and-forget) — Vercel serverless functions shut down before callbacks resolve
- Bali location constants live in `lib/constants/bali-locations.ts`
