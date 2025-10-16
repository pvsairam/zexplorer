# Zama fhEVM Block Explorer - Design Guidelines

## Design Approach: Utility-First Data Explorer

**System Foundation:** Hybrid approach combining Etherscan's proven block explorer patterns with modern design system principles (Material Design for data components + custom Zama-specific elements)

**Core Principles:**
- Data clarity and scannability over decorative elements
- Functional hierarchy for complex blockchain information
- Trust and transparency through clean, professional aesthetics
- Unique visual language for encrypted data indicators

---

## Color Palette

**Light Mode:**
- Primary: 212 100% 45% (Deep blue - trustworthy, technical)
- Surface: 0 0% 100% (Pure white backgrounds)
- Surface Secondary: 220 13% 96% (Light gray for cards/tables)
- Border: 220 13% 91% (Subtle dividers)
- Text Primary: 222 47% 11% (Near black)
- Text Secondary: 215 14% 34% (Muted gray)
- Encrypted Indicator: 280 70% 60% (Purple - represents FHE encryption)
- Success: 142 71% 45% (Transaction success)
- Warning: 38 92% 50% (Pending states)
- Error: 0 84% 60% (Failed transactions)

**Dark Mode:**
- Primary: 212 100% 55% (Lighter blue for contrast)
- Surface: 222 47% 11% (Dark background)
- Surface Secondary: 217 33% 17% (Elevated cards)
- Border: 217 33% 22% (Subtle dividers)
- Text Primary: 0 0% 98% (Near white)
- Text Secondary: 220 9% 65% (Muted gray)
- Encrypted Indicator: 280 70% 70% (Lighter purple for dark mode)

**Accent Colors (Zama-Specific):**
- ACL Authorized: 142 71% 45% (Green - has permission)
- Coprocessor Active: 212 100% 55% (Blue - processing)
- Handle Display: 280 50% 55% (Purple tint - encrypted handles)

---

## Typography

**Font Stack:**
- Primary: 'Inter', system-ui, -apple-system, sans-serif
- Monospace: 'JetBrains Mono', 'Fira Code', Consolas, monospace (for hashes, addresses, handles)

**Scale:**
- Hero/Page Titles: text-3xl font-bold (30px)
- Section Headers: text-xl font-semibold (20px)
- Data Labels: text-sm font-medium uppercase tracking-wide (12px)
- Body/Data Values: text-base font-normal (16px)
- Small Data: text-sm (14px)
- Hash/Address: text-sm font-mono (14px monospace)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 (0.5rem increments)
- Component padding: p-4 to p-6
- Section spacing: mb-8 to mb-12
- Card gaps: gap-4 to gap-6
- Table cell padding: px-4 py-3

**Grid Structure:**
- Max content width: max-w-7xl mx-auto
- Two-column details: grid-cols-1 md:grid-cols-2 gap-6
- Table layouts: Full width with horizontal scroll on mobile
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4

---

## Component Library

### Navigation
- Sticky top header with logo, search bar (prominent), network selector
- Breadcrumb navigation on detail pages
- Search: Unified search with type detection (block/tx/address)
- Dark mode toggle in header

### Data Display Components

**Block/Transaction Cards:**
- White/elevated background with subtle border
- Header with identifier (block number/tx hash in mono font)
- Grid layout for key-value pairs: label (muted, uppercase) + value (prominent)
- Status badges: Rounded pills with colored backgrounds
- Timestamp: Relative time with tooltip showing absolute

**Tables:**
- Zebra striping (every other row slightly tinted)
- Sticky headers on scroll
- Right-aligned numeric columns
- Mono font for hashes/addresses with truncation (show first 6 + last 4 chars)
- Hover row highlight

**Encrypted Data Indicators:**
- Badge component with purple tint background
- Lock icon prefix
- Encrypted type label (euint64, ebool, etc.) in mono font
- Tooltip on hover explaining handle system
- "View" button for authorized addresses (checks ACL)

**ACL Viewer:**
- Collapsible section in transaction/value details
- List of authorized addresses with avatar/identicons
- Permission type indicators (view/transfer/etc.)
- "You have access" highlight when user's wallet is authorized

**Coprocessor Status:**
- Linear progress indicator for pending computations
- Status pills: "Pending" (yellow), "Computing" (blue pulse), "Completed" (green)
- Estimated time remaining when applicable

### Forms & Interactive Elements
- Search input: Large, centered on homepage; compact in header on other pages
- Connect Wallet button: Prominent in header when decryption available
- Decrypt button: Purple accent, only shown when user has ACL permission
- Pagination: Numbered buttons + prev/next, current page highlighted

### Cards & Containers
- Rounded corners: rounded-lg (8px)
- Subtle shadows: shadow-sm on light, border on dark
- Hover state: Slight elevation increase (shadow-md transition)

---

## Page-Specific Layouts

**Homepage:**
- Latest blocks table (10 rows, auto-refresh)
- Latest transactions table (10 rows, auto-refresh)
- Network stats cards at top (4-column grid): Total Blocks, Total Transactions, Active Addresses, Coprocessor Jobs
- Central search bar hero section (no large image, focus on functionality)

**Block Detail Page:**
- Block header card: Number, hash, timestamp, proposer
- Statistics grid: Gas used, transaction count, size
- Transaction list table (paginated)
- Encrypted values section (if any) with ACL indicators

**Transaction Detail Page:**
- Transaction overview card
- From/To address cards with identicons
- Input data section (with encrypted type detection)
- Event logs with encrypted event highlighting
- Decryption panel (collapsible, only if user authorized)

**Address Page:**
- Address header with balance (encrypted indicator if applicable)
- Tabs: Transactions, Internal Transactions, ERC-20 Transfers, ACL Permissions
- Transaction history table
- Portfolio section showing encrypted token balances with handles

---

## Zama-Specific Visual Elements

**Handle Display Format:**
- Monospace font with purple-tinted background
- Format: `0x[handle_hex]` with copy button
- Tooltip: "Encrypted handle - request decryption to view value"

**Encryption Type Badges:**
- euint64: Purple badge, "Encrypted Unsigned Integer (64-bit)"
- ebool: Purple badge, "Encrypted Boolean"  
- eaddress: Purple badge, "Encrypted Address"
- Custom icons for each type

**Decryption Flow UI:**
- Modal overlay for decryption request
- Progress stepper: Connect Wallet → Request Gateway → Decrypt → View
- Success state shows decrypted value with "eye" icon
- Copy decrypted value functionality

---

## Animations & Interactions

- Page transitions: Minimal fade (150ms)
- Table row hover: Background color change (100ms)
- Live data updates: Subtle pulse on new block/transaction
- Skeleton loaders for initial data fetch
- Coprocessor status: Subtle pulse animation on "Computing" state
- No decorative animations - focus on data clarity

---

## Accessibility & Responsiveness

- WCAG AA compliant contrast ratios
- Focus indicators on all interactive elements
- Screen reader labels for icons and badges
- Responsive tables: Horizontal scroll on mobile with sticky first column
- Touch-friendly targets (min 44px) on mobile
- Keyboard navigation support for all functions