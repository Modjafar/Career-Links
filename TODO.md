# Career Links Enhancement TODO

## Plan Steps (Step-by-step implementation):

### Phase 1: Models & Dependencies
- [x] 1. Create backend/models/Opportunity.js (for dynamic data storage)
- [x] 2. Create backend/models/SavedItem.js (user saved opps)
- [x] 3. Create backend/models/Analytics.js (tracking)
- [x] 4. Add nodemailer to package.json & npm install

### Phase 2: Backend Enhancements
- [x] 5. Update backend/routes/api.js: Mongo integration for opps, add /search, /saved, /save, /track, /send-email
- [ ] 6. Enhance register to send welcome email
- [ ] 7. Protect new routes w/ auth

### Phase 3: Frontend Dashboard
- [x] 8. Create frontend/dashboard.html
- [x] 9. Create frontend/js/dashboard.js (fetch saved, display cards)
- [x] 10. Create frontend/css/dashboard.css

### Phase 4: Search/Filter & UI
- [x] 11. Edit frontend/index.html: Add search bar/form
- [x] 12. Edit frontend/js/script.js: Search fetch, cards display, save/apply btns w/ auth
- [x] 13. Edit frontend/css/style.css: Cards, animations, dark mode toggle, responsive

### Phase 5: Polish & Test
- [ ] 14. Add sample data seed script/route
- [ ] 15. Update navbar all pages w/ dashboard/logout links
- [ ] 16. Test all features, fix issues

**Current Progress: Phase 1 Step 2 complete**

**Next Step: 4. Add nodemailer to package.json & install**
