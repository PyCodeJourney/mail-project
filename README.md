# Email Client Front-end Implementation

## Task
Design a front-end for an email client that makes API calls to send and receive emails.

## Mail Project Specifications

Using JavaScript, HTML, and CSS, complete the implementation of your single-page-app email client inside of `inbox.js` (and not additional or other files; for grading purposes, we’re only going to be considering `inbox.js`!).

### Send Mail

- When a user submits the email composition form, add JavaScript code to actually send the email.
- Make a POST request to `/emails`, passing in values for recipients, subject, and body.
- Once the email has been sent, load the user’s sent mailbox.

### Mailbox

- When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
- Make a GET request to `/emails/<mailbox>` to request the emails for a particular mailbox.
- When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
- The name of the mailbox should appear at the top of the page.
- Each email should be rendered in its own box (e.g., as a `<div>` with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
- If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.

### View Email

- When a user clicks on an email, the user should be taken to a view where they see the content of that email.
- Make a GET request to `/emails/<email_id>` to request the email.
- Show the email’s sender, recipients, subject, timestamp, and body.
- Add an additional div to `inbox.html` for displaying the email.
- Hide and show the right views when navigation options are clicked.
- Once the email has been clicked on, mark the email as read by sending a PUT request to `/emails/<email_id>`.

### Archive and Unarchive

- Allow users to archive and unarchive emails they have received.
- When viewing an Inbox email, present a button to archive the email. When viewing an Archive email, present a button to unarchive the email.
- This requirement does not apply to emails in the Sent mailbox.
- Send a PUT request to `/emails/<email_id>` to mark an email as archived or unarchived.
- Once an email has been archived or unarchived, load the user’s inbox.

### Reply

- Allow users to reply to an email.
- When viewing an email, present a “Reply” button to reply to the email.
- Clicking the “Reply” button should take the user to the email composition form.
- Pre-fill the composition form with the recipient field set to whoever sent the original email.
- Pre-fill the subject line. If the original email had a subject line of foo, the new subject line should be Re: foo. (If the subject line already begins with Re:, no need to add it again.)
- Pre-fill the body of the email with a line like "On Jan 1, 2020, 12:00 AM foo@example.com wrote:" followed by the original text of the email.
