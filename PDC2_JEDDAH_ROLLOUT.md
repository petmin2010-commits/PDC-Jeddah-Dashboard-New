# PDC 2 — Jeddah branch rollout
- Independent from Makkah: all data access uses Jeddah APP pages and its own SPREADSHEET_ID.
- Sidebar «اجتماع PDC 2» is directly under «اجتماع الـ PDC».
- dp users ACL option added in «المتابعة الإدارية»; exact v2 permissions respected. Legacy users may inherit the original PDC permission only until upgraded to v2.
- Current tab includes live PDC workorders, permits, emergencies, saved safety/quality reports, and weekly manual entries.
- Manual records are stored per week in the Jeddah workbook sheet `PDC Meeting 2 Manual Data`, auto-created on first save.
- The 44-slide source report is specific to Makkah. No Makkah template, images, or data are copied to Jeddah. Export remains disabled until a Jeddah-approved slide template is available.
- Authentication and authorization are read dynamically from dp users via /api/auth/me; page visibility tested for allowed, denied, and legacy accounts.
