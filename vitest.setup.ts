// jsdom does not implement scrolling; the router calls it on every navigation.
window.scrollTo = () => {}
