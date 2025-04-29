# Fullstack App 1: Secret Gold

A user-authentication enabled app where you can press a combination of buttons to acquire gold. Different three-button sequences will produce varying amounts of gold, where the majority of combinations yield 0 gold, some yield positive amounts (up to 100), and some result in a loss of gold. The bottom button will reset the current sequence.

![secret-gold](https://github.com/user-attachments/assets/23c96cd2-383a-4e4e-b34f-8b57a6e7239f)

*Screenshot of the button panel page*

## How It’s Made

**Tech Stack:**  
- **Backend:** Node.js, Express.js, Passport.js (user authentication)
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS, HTML, CSS, JS  

## How It Works
- When a user presses one of the five buttons, it makes an API call that sends the user ID and button ID to the server.
- From there, the button's ID is entered into a combinations array attached to the user document in the associated database.
- Once a user's combinations array has three entries, the sequence is compared against the arrangements object to determine the yielded gold amount.

## Installation

1. Clone repo
2. run `npm install`

## Usage

1. run `node server.js`
2. Navigate to `localhost:8080`
3. Create an account

## Inspiration & Credit

README.md layout modified from **CodingWCal**'s template
