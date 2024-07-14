# Memory lane

### Problem definition

After a series of discovery calls we found out a problem that our users are facing. They are having a hard time sharing their memories with friends and family. They are using a combination of social media, messaging apps, and email to share their memories. They are looking for a solution that allows them to store and share their memories in a single place.

As a first iteration for this solution, we want to build a web application that allows users to create a memory lane and share it with friends and family. A memory lane is a collection of events that happened in a chronological order. Each event consists of a title, a description, a timestamp, and at least one image.

### Inspiration mockup

![Memory lane mockup](./memory_lane.png)

## Summary of Changes

- Integrated React Router for navigation.
- Implemented UI components with tailwind and HeadlessUI:
    - Dropdown Menu
    - Dialog 
    - File Upload
    - Toast
- Added Axios API client.
- Added Infinite Scrolling to  Timeline.
- Enabled creation, deletion, detail, and editing of memories.
- Added CORS support.
- Added user registration and editing for a single user.
- Added file upload and sharing endpoints. 
- Implemented ordering/filtering of memories by date
- Memory Sharing by url link

For more details, visit the [PR on GitHub](https://github.com/rubensoleao/rubens/pull/1/files).
