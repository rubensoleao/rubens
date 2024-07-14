# Planned coding challenge: Memory lane

**Please avoid initiating pull requests on this repository or forking this repository. To submit your solution, either set up a repository on your own account or forward a zip file to the appropriate contact within our talent team.**

### Problem definition

After a series of discovery calls we found out a problem that our users are facing. They are having a hard time sharing their memories with friends and family. They are using a combination of social media, messaging apps, and email to share their memories. They are looking for a solution that allows them to store and share their memories in a single place.

As a first iteration for this solution, we want to build a web application that allows users to create a memory lane and share it with friends and family. A memory lane is a collection of events that happened in a chronological order. Each event consists of a title, a description, a timestamp, and at least one image.

## Deliverables

- Clone this repository and create a new branch with your name. Open a pull request on your own instance of the repository.
- An updated README providing a high level explanation of your implementation.
- **Screenshots or a short video/gif** showing your UI implementation.
- Update the API to accommodate for your technical design. Run the API by using `npm run serve:api`.
- The provided mockup is only for reference and inspiration. Feel free to improve it!

### FAQ

- **Can I add a framework like Next?** If you have the time, go for it, we want to see you use your favorite tools.
- **Is user authentication required?** No, it is not required.
- **Can I use a component library?** Yes, you can use a component library.
- **What will you be looking for?** Good user experience, reusable code, and a well thought out technical design.

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