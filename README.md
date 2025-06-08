# Naavi Payment System

This is a simple student payment system built with **Node.js** (Express) and a tiny **React** interface. Payments are stored in a JSON file on the server.

## Features

- Assigns a unique ID to each payment
- Records the payment timestamp (UTC)
- Captures parent name, student name, student ID and amount
- React UI to enter and list payments

## Running

1. Make sure Node.js is available.
2. Start the server:
   ```bash
   node server.js
   ```
3. Open `http://localhost:3000` in your browser.

All payment data will be saved to `payments.json` in the project root.
