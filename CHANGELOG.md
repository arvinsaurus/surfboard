# Surfboard Changelog

## [1.1.0] - 2026-04-22

### Web App
- Added grid / list view toggle — single button that shows the current view's icon
- Added Tools / Design section switcher — single toggle button (outline style) that switches sections on click
- Mobile drawer: section toggle and view toggle now sit in the same header row as the close button
- Mobile drawer no longer closes when switching sections
- All toggles (view, section) use outline style to reduce visual weight vs Search/Add actions
- Desktop sidebar: section and view toggles grouped together in the top-right of the branding row

### Raycast Extension
- Added section support to Save and Edit forms — choose between Tools and Design when saving a resource
- Design section has its own tag set (Isometric, Brutalism, Scroll Animation, etc.)
- Tags list updates dynamically based on the selected section

## [1.0.0] - 2026-03-01

### Initial Release
- Save tools from Raycast with URL, name, tags, and description
- Search tools by keyword, tag, or description
- Browse tools organized by tag category
- Bulk import multiple URLs at once
- In-app onboarding: member name input and hotkey setup guidance
- Real-time sync via Supabase — shared across the team
- Web dashboard for browsing the shared library in a browser
- Mobile-friendly web view with bottom bar navigation and swipeable drawer
- Search modal with `/` shortcut
