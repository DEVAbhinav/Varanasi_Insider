# Educational Content Portal - User Requirements Document (Simplified)

**For:** Sir Tarun Rupani  
**Prepared By:** vistalabs.in 
**Date:** December 5, 2025  
**Version:** 2.0 (Simplified - Content Distribution Focus)

---

## Executive Summary

A **content distribution platform** where Sir Tarun Rupani (admin) uploads and organizes educational materials (PDFs, YouTube videos) and students freely access them without login.

**Core Purpose:** Free notes/resources repository organized by Class → Subject → Chapter

**No Student Accounts Needed** - Students browse anonymously or with optional email signup

---

## 1. PLATFORM OVERVIEW

### 1.1 What This Platform Does

```
Admin (Sir Tarun Rupani)
    ↓
Logs in → Uploads PDFs & YouTube videos
    ↓
Organizes by Class/Subject/Chapter
    ↓
Public Website
    ↓
Students Access Content Freely (No Login)
```

### 1.2 Key Characteristics

- ✅ **Zero-friction access** - Students don't create accounts
- ✅ **Simple structure** - Class → Subject → Chapter → Resources
- ✅ **Two content types** - PDFs (downloadable) and YouTube videos (embedded)
- ✅ **One admin** - Only you manage content
- ✅ **Public by default** - All content visible to everyone
- ✅ **Mobile-friendly** - Works on phones/tablets
- ✅ **Fast & lightweight** - Quick page loads

---

## 2. CONTENT ORGANIZATION

### 2.1 Hierarchy Structure

```
Class (e.g., "Class 10", "Commerce", "JEE Prep")
  ├── Subject (e.g., "Mathematics", "Physics", "Chemistry")
  │    ├── Chapter (e.g., "Quadratic Equations", "Mechanics")
  │    │    ├── PDF Resource 1
  │    │    ├── PDF Resource 2
  │    │    ├── YouTube Video 1
  │    │    └── YouTube Video 2
  │    └── Chapter 2
  └── Subject 2
```

**Questions for Sir Tarun Rupani:**

1. How many classes do you plan?
   - Example: "Class 10", "Class 12", "Commerce", "Science", "JEE", "NEET"
   - Count: _______

2. How many subjects per class (average)?
   - Example: "Math", "Physics", "Chemistry", "Biology"
   - Count: _______

3. How many chapters per subject (average)?
   - Count: _______

4. How many resources per chapter (average)?
   - Count: _______

---

## 3. ADMIN PANEL FUNCTIONALITY

### 3.1 What You (Admin) Can Do

The admin panel is **simple and fast** with these core features:

#### A. **Create Class**
- [ ] Enter class name (e.g., "Class 10")
- [ ] Add class description (optional)
- [ ] Upload class thumbnail image (optional)
- [ ] Save & activate

#### B. **Create Subject within Class**
- [ ] Select class
- [ ] Enter subject name (e.g., "Mathematics")
- [ ] Add subject description (optional)
- [ ] Upload subject thumbnail (optional)
- [ ] Save

#### C. **Create Chapter within Subject**
- [ ] Select subject
- [ ] Enter chapter name (e.g., "Quadratic Equations")
- [ ] Add chapter description (optional)
- [ ] Save

#### D. **Upload PDF Resource**
- [ ] Select class → subject → chapter
- [ ] Enter resource name (e.g., "Chapter Notes - Quadratic Equations")
- [ ] Upload PDF file (system shows file size & preview)
- [ ] Optional: Add description/notes about the PDF
- [ ] Save

**Questions:**
- [ ] Should PDFs be downloadable?
- [ ] Should PDFs be view-only (in-browser)?
- [ ] Should PDFs be both (viewable + downloadable)?

#### E. **Embed YouTube Video**
- [ ] Select class → subject → chapter
- [ ] Enter video title (e.g., "Solving Quadratic Equations - Tutorial")
- [ ] Paste YouTube URL or video ID
- [ ] Video auto-embeds and displays
- [ ] Optional: Add description/notes below video
- [ ] Save

#### F. **Edit/Delete Resources**
- [ ] See list of all resources
- [ ] Edit names, descriptions
- [ ] Delete resources (with confirmation)
- [ ] Reorder resources by drag-and-drop

#### G. **View Dashboard**
- [ ] Total classes created
- [ ] Total subjects created
- [ ] Total chapters created
- [ ] Total resources uploaded
- [ ] Total downloads (if tracking)
- [ ] Recent uploads

---

## 4. PUBLIC WEBSITE (What Students See)

### 4.1 Homepage

**Design:**
- Header with site name/logo
- Hero section: "Free Notes & Study Materials"
- Search bar (optional - can be added later)
- Grid of classes (with thumbnails)

**Content:**
- [ ] "Browse by Class"
- [ ] List all classes
- [ ] Each class shows: Name, thumbnail, number of subjects

### 4.2 Class Page

When student clicks a class:
- [ ] Class name & description
- [ ] List all subjects in this class
- [ ] Each subject shows: Name, thumbnail, number of chapters

### 4.3 Subject Page

When student clicks a subject:
- [ ] Subject name & description
- [ ] List all chapters in this subject
- [ ] Each chapter shows: Name, number of resources

### 4.4 Chapter Page

When student clicks a chapter:
- [ ] Chapter name & description
- [ ] All resources displayed:
  - **PDFs:** Preview thumbnail + "View" or "Download" button
  - **YouTube Videos:** Embedded player (play directly on page)
- [ ] Clean, organized layout
- [ ] One resource per line or card

### 4.5 Optional Features (Nice-to-Have)

- [ ] **Search functionality** - Search for chapters/PDFs across all classes
- [ ] **Breadcrumb navigation** - Show: Home > Class > Subject > Chapter
- [ ] **Related resources** - "See also" suggestions
- [ ] **Download counter** - Show how many times each resource was downloaded
- [ ] **Last updated date** - Show when resource was added
- [ ] **Favorites/Bookmarks** - Let students bookmark resources (no login needed, uses browser storage)
- [ ] **Responsive design** - Auto-adjusts for mobile/tablet/desktop

---

## 5. TECHNICAL REQUIREMENTS

### 5.1 Server & Hosting

**What you need:**
- [ ] Web hosting to run the website
- [ ] Server storage for uploaded PDFs
- [ ] Database to store class/subject/chapter structure (small, lightweight)
- [ ] HTTPS (secure connection - lock icon in browser)
- [ ] Automatic backups (weekly or daily)

**Questions:**
- How much storage space will you need? (Estimate total GB of PDFs)
  - Current: _______
  - Future (2 years): _______

### 5.2 Content Storage

**PDFs:**
- [ ] Stored on your server (fast downloads)
- [ ] OR stored on cloud (Google Drive, Dropbox)
- [ ] Max file size per PDF? (Suggestion: 50-100 MB)

**YouTube Videos:**
- [ ] Hosted on YouTube (you control)
- [ ] Embedded directly in your site
- [ ] No storage needed on your server

### 5.3 Admin Panel Technology

**Admin panel needs:**
- [ ] Secure login (username/password)
- [ ] Simple drag-and-drop file upload
- [ ] Form to create classes/subjects/chapters
- [ ] List views to manage content
- [ ] Edit/delete options
- [ ] No complex features needed

### 5.4 Website Technology

**Frontend (what students see):**
- [ ] Mobile-responsive design (works on phones)
- [ ] Fast page loads (< 2 seconds)
- [ ] Clean, simple UI
- [ ] PDF embedded viewer (option to download)
- [ ] YouTube player embedded
- [ ] Search functionality (optional, add later)

---

## 6. CONTENT TYPES SUPPORTED

### 6.1 PDFs

**Functionality:**
- [ ] Upload PDF files from your computer
- [ ] Display PDF preview (first page visible)
- [ ] View PDF in browser (embedded viewer)
- [ ] Download PDF to computer
- [ ] Show file size (e.g., "2.5 MB")
- [ ] Show upload date

**Supported:**
- Study notes
- Previous year question papers
- Solved examples
- Formulas/reference sheets
- Complete chapters/eBooks

### 6.2 YouTube Videos

**Functionality:**
- [ ] Paste YouTube link or video ID
- [ ] Auto-embed in your page
- [ ] Student watches directly on your site
- [ ] No need to upload videos (YouTube hosts them)
- [ ] Show video duration
- [ ] Show upload date

**Supported:**
- Tutorial videos
- Concept explanations
- Problem-solving walkthroughs
- Lecture recordings
- Expert talks

### 6.3 Future Content Types (Optional)

- [ ] Google Drive/Dropbox links
- [ ] Links to external websites
- [ ] Images & infographics
- [ ] Word documents (.docx)
- [ ] PowerPoint presentations
- [ ] Excel spreadsheets

---

## 7. SECURITY & PERFORMANCE

### 7.1 Security

**Admin Panel:**
- [ ] Secure login (only you)
- [ ] Password-protected access
- [ ] Session timeout (auto-logout after inactivity)
- [ ] SSL encryption (HTTPS)

**Public Website:**
- [ ] No login required
- [ ] All content publicly accessible
- [ ] DDoS protection (if budget allows)
- [ ] Regular backups

### 7.2 Performance

**Website Speed:**
- [ ] Pages load in < 2 seconds
- [ ] PDFs open quickly
- [ ] YouTube videos load without buffering
- [ ] Works smoothly on 3G/4G connections

**Uptime:**
- [ ] 99% availability (rarely goes down)
- [ ] Automatic backups
- [ ] Disaster recovery plan

---

## 8. ANALYTICS & TRACKING

### 8.1 What to Track (Optional)

**Admin Dashboard can show:**
- [ ] Total visitors (per day/week/month)
- [ ] Most popular classes
- [ ] Most downloaded PDFs
- [ ] Most watched videos
- [ ] Geographic data (where visitors from)
- [ ] Device info (mobile vs desktop)
- [ ] Traffic trends (graph showing growth)

**Questions:**
- Do you want detailed analytics?
- Or just basic tracking (total visitors)?

---

## 9. SEO & DISCOVERABILITY

### 9.1 Search Engine Optimization

**To help students find your content:**
- [ ] Each class/subject/chapter has SEO title & description
- [ ] Meta tags for Google Search
- [ ] URL structure optimized (e.g., /class-10/mathematics/quadratic-equations)
- [ ] Sitemap (helps Google find all pages)
- [ ] Mobile-friendly (Google prioritizes this)
- [ ] Fast page speed (Google ranks this highly)

**Questions:**
- What keywords should we target? (e.g., "Class 10 Math Notes", "JEE Physics PDFs")
- Keywords: _______

---

## 10. ADMIN WORKFLOW

### 10.1 Step-by-Step: How You'll Use It

**Day 1 - Setup:**
1. Log in to admin panel
2. Create "Class 10"
3. Create "Mathematics" subject
4. Create "Quadratic Equations" chapter
5. Save

**Day 2 - Upload Resources:**
1. Go to Class 10 → Mathematics → Quadratic Equations
2. Upload PDF file ("Quadratic_Equations_Notes.pdf")
3. Paste YouTube URL ("https://youtube.com/watch?v=...")
4. Save

**Result:** Student sees both resources immediately on the website

### 10.2 Content Upload Frequency

**Questions:**
- How often will you upload content?
  - [ ] Daily
  - [ ] Weekly
  - [ ] Monthly
  - [ ] As needed

- How many resources per month (average)?
  - Count: _______

---

## 11. OPTIONAL FEATURES

Pick which appeal to you:

- [ ] **Search bar** - Students search for PDFs/videos
- [ ] **Categories/Tags** - Organize by topic beyond hierarchy
- [ ] **"New" badge** - Show recently added resources
- [ ] **Download counter** - "Downloaded 2,543 times"
- [ ] **Rating system** - Students rate resources (1-5 stars)
- [ ] **Comments section** - Students leave feedback/corrections
- [ ] **Newsletter signup** - Collect emails for announcements
- [ ] **Social sharing** - Share button for Twitter/LinkedIn
- [ ] **Dark mode** - Light/dark theme toggle
- [ ] **Multi-language** - Translate to Hindi/regional languages
- [ ] **Mobile app** - iOS/Android app (can be added later)
- [ ] **Print-friendly** - Optimized PDF printing
- [ ] **Google Analytics integration** - Detailed traffic tracking
- [ ] **WhatsApp integration** - Send updates via WhatsApp

---

## 12. FUTURE ROADMAP

**Phase 1 - Launch (Weeks 1-4):**
- [ ] Admin panel with class/subject/chapter/resource creation
- [ ] Public website with browse functionality
- [ ] PDF upload & display
- [ ] YouTube video embedding
- [ ] Basic responsive design
- [ ] Admin login

**Phase 2 - Enhancement (Months 2-3):**
- [ ] Search functionality
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Mobile app (optional)
- [ ] Newsletter feature

**Phase 3 - Advanced (Months 4-6):**
- [ ] Rating/comments system
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API for third-party integration
- [ ] Premium content (gated/paid)

---

## 13. QUESTIONS FOR SIR TARUN RUPANI

**Please answer:**

### Structure Questions:
1. **Classes you'll create:**
   - List: _______________________
   
2. **Expected growth:**
   - Year 1 resources: _______
   - Year 2 resources: _______

3. **Content mix:**
   - Percentage PDFs: _______%
   - Percentage YouTube: _______%

### Functional Questions:
4. **PDF handling:**
   - [ ] View only (in-browser)
   - [ ] Download only
   - [ ] Both (view + download)

5. **Analytics needed:**
   - [ ] Yes - detailed tracking
   - [ ] No - basic only
   - [ ] Optional for later

6. **Features you want on Day 1:**
   - Must-have: _______________________
   - Nice-to-have: _______________________

### Technical Questions:
7. **Domain name:**
   - What domain? (e.g., "notes.tarunrupani.com")
   - Domain: _______________________

8. **Branding:**
   - [ ] Your name/logo on site?
   - [ ] Tagline/description?

9. **Content storage budget:**
   - How much storage needed?
   - Budget for annual hosting: _______

---

## 14. NEXT STEPS

1. **Review this document** (2-3 days)
2. **Answer the questions above** 
3. **Prioritize features** (what's most important)
4. **Technical kickoff** (we plan architecture)
5. **Design phase** (UI mockups)
6. **Development** (build admin panel + website)
7. **Content upload** (you populate initial content)
8. **Testing** (QA and bug fixes)
9. **Launch** (go live!)
10. **Support** (ongoing maintenance)

---

## 15. QUICK REFERENCE: WHAT ADMIN CAN DO

| Action | Time | Frequency |
|--------|------|-----------|
| Create Class | 1 min | Rare (once per class) |
| Create Subject | 1 min | Rare (once per subject) |
| Create Chapter | 1 min | Regular (once per chapter) |
| Upload PDF | 2-5 min | Regular (daily/weekly) |
| Embed YouTube | 1 min | Regular (daily/weekly) |
| Edit Resource | 1 min | Occasional |
| Delete Resource | 30 sec | Occasional |
| View Dashboard | 5 min | Daily/Weekly |

---

## APPENDIX: GLOSSARY

| Term | Meaning |
|------|---------|
| **Admin Panel** | Backend system (password protected) where you manage content |
| **Public Website** | Frontend (no login) where students access content |
| **PDF** | Document file (study notes, question papers, eBooks) |
| **YouTube Video** | Video hosted on YouTube, embedded on your site |
| **SEO** | Search Engine Optimization (helps Google find your site) |
| **HTTPS** | Secure connection (lock icon in browser) |
| **Responsive Design** | Website works on mobile/tablet/desktop |
| **Sitemap** | List of all pages on your website (for Google) |
| **Analytics** | Tracking how many visitors and what they do |
| **DRM** | Digital Rights Management (prevents copying) |
| **CDN** | Content Delivery Network (serves files fast globally) |

---

**Document Status:** Version 2.0 - Simplified  
**Last Updated:** December 5, 2025  
**Next Review:** After Sir Tarun Rupani feedback

---

*This is a focused, lightweight platform designed for simple content distribution. Not a full LMS.*
