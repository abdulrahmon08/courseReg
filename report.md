# Short Report

## Problem
Students need a simple and clear way to select courses for a semester while staying within the credit limit and finalizing their registration without confusion. A user-friendly interface helps reduce errors and supports better academic planning.

## Design Decisions
The interface was designed with a clean academic portal style using a blue institutional palette, readable typography, and card-based layout. Search and department filters make it easy to browse the course list, while the summary panel keeps the registration information visible at all times.

## Implementation
The project uses semantic HTML, CSS layout styling, and JavaScript event handling. Course data is stored as an array and rendered dynamically. Students can add or remove courses, and the app automatically calculates the total credit units while enforcing a maximum of 18 credits.

## Testing
The pages were reviewed for functionality, including login validation, course selection, filtering, summary updates, and mobile responsive behavior. Browser interaction checks confirmed that selected course totals update correctly and that invalid submissions are blocked with clear feedback.

## Limitations
This is a front-end prototype and does not integrate with a real server or database. All registration details are stored only in the browser using localStorage.
