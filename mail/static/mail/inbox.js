document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector('#compose-form').addEventListener('submit', event => {
    event.preventDefault();
    submit_email();
  });
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  const emails_view = document.querySelector('#emails-view');
  emails_view.style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  emails_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        email_div = document.createElement("div");
        email_div.innerHTML = `<strong class="pr-2">${email.sender}</strong> ${email.subject} <span class="ml-auto">${email.timestamp}</span>`;
        email_div.classList.add("border", "p-2", "d-flex", `${email.read ? "bg-white" : "bg-light"}`);
        email_div.addEventListener('click', () => load_email(email, mailbox));
        emails_view.append(email_div);
      });
      if (emails.length === 0) {
        empty_div = document.createElement("div");
        empty_div.innerHTML = `${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)} is empty!`;
        empty_div.classList.add("text-center");
        emails_view.append(empty_div);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function submit_email() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    })
}

function load_email(email, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  const email_view = document.querySelector('#email-view');
  email_view.style.display = 'block';
  fetch(`/emails/${email.id}`)
    .then(response => response.json())
    .then(email => {
      email_view.innerHTML = `<div><strong>From:</strong> ${email.sender}</div>`;
      email_view.innerHTML += `<div><strong>To:</strong> ${email.recipients}</div>`;
      email_view.innerHTML += `<div><strong>Subject:</strong> ${email.subject}</div>`;
      email_view.innerHTML += `<div class="mb-3"><strong>Timestamp:</strong> ${email.timestamp}</div>`;
      email_view.innerHTML += `<button class="btn btn-sm btn-outline-primary mr-1" id="reply" onclick="reply(${email.id})">Reply</button>`;
      email_view.innerHTML += `<button class="btn btn-sm btn-outline-primary" id="archive" onclick="archive(${email.id}, ${email.archived})">${email.archived ? "Unarchive" : "Archive"}</button>`;
      email_view.innerHTML += '<hr>';
      email_view.innerHTML += `<div>${email.body}</div>`;
      if (document.querySelector('#user-email').innerHTML === email.sender) {
        document.querySelector('#archive').remove();
        document.querySelector('#reply').innerText = "Send another one";
      }
      if (mailbox === 'archive') {
        document.querySelector('#reply').remove();
      }
      if (mailbox === 'inbox') {
        mark_as_read(email.id);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function mark_as_read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
    .catch(error => {
      console.log(error);
    });
}

function archive(email_id, email_archived) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !email_archived
    })
  })
    .then(() => {
      load_mailbox('inbox');
    })
    .catch(error => {
      console.log(error);
    });
}

function reply(email_id) {
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      compose_email();
      const re = email.subject.startsWith('Re') ? '' : 'Re: ';
      document.querySelector('#compose-recipients').value = email.sender;
      document.querySelector('#compose-subject').value = re + email.subject;
      document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
    })
    .catch(error => {
      console.log(error);
    });
}