## Description
This project is an AI-powered hotel booking assistant that helps users find places and hotels through natural conversation.

## Prerequisites
- Node.js (version 20 or higher)
- Access to a supported large language model (LLM) (see: https://mastra.ai/docs)

## Installation
1. Install the dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file and add following API keys: 
* `OPENAI_API_KEY`
* `LITEAPI_API_KEY`
3. Run in dev mode
   ```bash
   npm run dev
   ```

## Usage
Once the server is running, you can interact with the hotel booking assistant through the designated interface.
The implementation is trivial and will help you book a hotel by requesting:
1. A location - It will proceed to show top 5 hotels for that location
2. Number of adults, children and period + Hotel preference - It will request top 5 rates for the selected hotel
3. Booking info, such as First name, Last name, Email and Phone number + extra guests
4. It will book the hotel for you!

## Testing
To run tests (if any are set up), use:
```bash
npm run test
```
