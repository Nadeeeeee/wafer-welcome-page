# Streamline the opening scroll

## Changes
- Treat the opening Creamy Cheese pack as flavor 1 of 6, with its name, label, and description visible immediately.
- Replace “Cheese comes first” with “Discover six bold flavors!”
- Remove the duplicate Creamy Cheese stop so the first scroll moves directly to Strawberry Cheese Cake.
- Recalculate the scroll sections, scene positions, backgrounds, progress markers, and final section timing for seven total stops.

## Verification
- Check the opening and every scroll stop on the current mobile-sized preview.
- Confirm the finale still appears correctly and no page errors remain.

## Technical details
- Keep all six products in the shared flavor list, but render Creamy Cheese in the opening and map only the remaining five product sections.
- Set the section count to opening product + five remaining products + finale.
