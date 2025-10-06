# Files That Can Be Deleted - Cleanup List

**Date**: October 4, 2025  
**Reason**: These files are now outdated or obsolete after reverting to the original sticky bar component

---

## 📋 Summary

After reverting to the original ServicePage sticky bar, several documentation and script files are now **obsolete and can be safely deleted**.

---

## Files to Delete

### 1. Outdated Sticky Bar Documentation (3 files)

These files document the **multi-variant sticky bar component** that was deleted:

#### ❌ `/docs/STICKY-BAR-IMPLEMENTATION-COMPLETE.md` (8.6K)
- **Why Delete**: Documents the removed multi-variant component (`/components/StickyContactBar/`)
- **Status**: Component no longer exists
- **Content**: Describes 3 variants (spiritual, service, simple) that are not being used
- **Replacement**: `/docs/STICKY-BAR-RESTORATION.md` is the current state

#### ❌ `/docs/STICKY-BAR-VISUAL-VERIFICATION.md` (6.0K)
- **Why Delete**: Visual tests for the removed multi-variant component
- **Status**: Tests transparency fixes for deleted component
- **Content**: Screenshots and analysis of component that no longer exists
- **Replacement**: Can create new tests for original component if needed

#### ❌ `/docs/STICKY-CONTACT-BAR-GUIDE.md` (9.9K)
- **Why Delete**: Guide for the **original** ServicePage sticky bar implementation
- **Status**: Could keep, but may be confusing alongside restoration doc
- **Content**: Technical guide for `/components/ServicePage/StickyContactBar.jsx`
- **Decision**: **KEEP** - This is actually useful documentation for the current component

---

### 2. Verification Scripts (1 file - Optional)

#### ⚠️ `/scripts/verify-sticky-bar-visual.py` (Optional - Keep or Delete)
- **Why Delete**: Created to test the removed multi-variant component
- **Status**: Still works but references "variant" testing
- **Content**: Selenium script for visual verification with variant testing
- **Decision**: 
  - **DELETE** if you don't need visual testing anymore
  - **KEEP & UPDATE** if you want to continue visual QA testing
  - Currently references variants that no longer exist in code

---

### 3. Screenshot Files (15 files - if they exist)

**Note**: The `tmp/sticky-bar-screenshots/` directory was already removed in a previous commit.

If these files somehow still exist locally (not in git), they can be deleted:

```
tmp/sticky-bar-screenshots/
├── blog-post-(spiritual)-desktop-after-scroll.png
├── blog-post-(spiritual)-desktop-before-scroll.png
├── blog-post-(spiritual)-desktop-hover-focus.png
├── blog-post-(spiritual)-mobile-after-scroll.png
├── blog-post-(spiritual)-mobile-before-scroll.png
├── homepage-desktop-after-scroll.png
├── homepage-desktop-before-scroll.png
├── homepage-desktop-hover-focus.png
├── homepage-mobile-after-scroll.png
├── homepage-mobile-before-scroll.png
├── service-page-desktop-after-scroll.png
├── service-page-desktop-before-scroll.png
├── service-page-desktop-hover-focus.png
├── service-page-mobile-after-scroll.png
└── service-page-mobile-before-scroll.png
```

**Status**: Already deleted from git in commit `2645133`

---

### 4. Other Old CTA Documentation (Optional - Keep for History)

These are related to the CTA implementation (not sticky bar) and **should probably be kept** for historical reference:

#### ✅ KEEP `/docs/CTA-COVERAGE-SUMMARY.md` (5.7K)
- Documents modular CTA implementation
- Still relevant as CTAs are active

#### ✅ KEEP `/docs/CTA-VERIFICATION-REPORT.md` (7.4K)
- Verification of CTA implementation
- Historical record of testing

#### ✅ KEEP `/docs/MODULAR-CTA-IMPLEMENTATION.md` (7.3K)
- Implementation guide for modular CTAs
- Still useful reference

#### ✅ KEEP `/scripts/verify-cta.py`
- CTA verification script
- Still useful for testing CTAs

---

## Recommended Deletion Commands

### Safe to Delete Immediately:

```bash
# Delete outdated sticky bar documentation (multi-variant component docs)
rm docs/STICKY-BAR-IMPLEMENTATION-COMPLETE.md
rm docs/STICKY-BAR-VISUAL-VERIFICATION.md

# Optional: Delete visual verification script if not needed
rm scripts/verify-sticky-bar-visual.py
```

### Verification Script Update (Alternative to Deletion):

If you want to **keep** `verify-sticky-bar-visual.py` for future testing, update it to:
- Remove variant testing
- Test only the original component
- Update expected background colors to yellow-orange gradient

---

## Files to KEEP

### Current Documentation (Keep):
- ✅ `/docs/STICKY-BAR-RESTORATION.md` - **Current state** of sticky bar
- ✅ `/docs/STICKY-CONTACT-BAR-GUIDE.md` - Guide for original component
- ✅ `/docs/SERVICE-PAGE-STRUCTURE.md` - Service page architecture
- ✅ All CTA-related documentation (still relevant)
- ✅ `/docs/404-ANALYSIS-AND-FIX-PLAN.md` - SEO work
- ✅ `/docs/SUBDOMAIN-REDIRECT-ISSUE.md` - Infrastructure issue

---

## Summary Table

| File | Size | Status | Action |
|------|------|--------|--------|
| `STICKY-BAR-IMPLEMENTATION-COMPLETE.md` | 8.6K | Obsolete | ❌ DELETE |
| `STICKY-BAR-VISUAL-VERIFICATION.md` | 6.0K | Obsolete | ❌ DELETE |
| `verify-sticky-bar-visual.py` | - | Optional | ⚠️ DELETE or UPDATE |
| `STICKY-CONTACT-BAR-GUIDE.md` | 9.9K | Current | ✅ KEEP |
| `STICKY-BAR-RESTORATION.md` | 3.7K | Current | ✅ KEEP |
| `tmp/sticky-bar-screenshots/*` | ~14MB | Deleted | ✅ Already removed |

---

## Total Space to Reclaim

- **Documentation**: ~14.6K (2 files)
- **Scripts**: ~2K (1 file, optional)
- **Screenshots**: Already deleted
- **Total**: ~16.6K

---

## After Deletion Checklist

- [ ] Delete `STICKY-BAR-IMPLEMENTATION-COMPLETE.md`
- [ ] Delete `STICKY-BAR-VISUAL-VERIFICATION.md`
- [ ] Decide on `verify-sticky-bar-visual.py` (delete or update)
- [ ] Commit changes with message: "Clean up outdated sticky bar documentation"
- [ ] Verify no broken links in remaining docs
- [ ] Update README if it references deleted files

---

**Recommendation**: Delete the 2 obsolete documentation files immediately. The visual verification script can be deleted if you don't plan to do visual testing, or updated if you want to keep testing capability.
