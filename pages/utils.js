/**
 * @file
 * Useful utility functions
 */

/**
 * Track custom events in Spoor
 * @param {string} category Event category
 * @param {string} action Action description
 * @param {object} extraDetail Extra info to add to the event
 */
export function sendSpoorEvent(category, action, extraDetail) {
  const event = new CustomEvent('oTracking.event', {
    detail: {
      category,
        action,
      ...extraDetail
    },
    bubbles: true,
  });
  document.body.dispatchEvent(event);
}

export default {
  sendSpoorEvent,
};
