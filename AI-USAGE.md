# AI Coding Assistant Usage Log

## Assistant Used
- Primary: Cursor (gpt-4o-mini and somtimes Auto)
- Added as context the codebase, the liteAPI Docs and Mastra Docs

## Key Interactions

### 1. Initial Implementation
**Task:** Let the AI write an initial implementation of the coding challenge
**Prompt Used:** A comprehensive summary of the coding challenge with functional and technical requirements
**Output Quality:** Bad
**Modifications Made:** Haven't kept anything, but it gave me an idea on how to approach the problem

### 2. Tool Implementation - Search places
**Task:** First step: search for a place
**Prompt Used:** Let's start step by step. The first tool should be used to search for a list of places using the /data/places endpoint of liteAPI. The endpoint accepts the query param `textQuery`. Please write this tool and we will continue with the others as we progress. Please create the agent and instruct to perform only this action (retrieving a place) for now
**Output Quality:** Good, the code was usable and did exactly what requested
**Modifications Made:** Minor

### 3. Tool Implementation - Search hotels
**Task:** Second step: search for hotels in the specified place
**Prompt Used:** For the next tool we will need the placeId and retrieve a list of hotels in that place based on the placeId. The liteAPI endpoint for this is `data/hotels`. Please create the tool and inform the agent about further instructions. The agent can now use the tool to search for a list of places and then search for hotels in a place based on the placeId
**Output Quality:** Good
**Modifications Made:** Minor

### 4. Tool Implementation - Search hotels
**Task:** Third step: search for rates for specific hotels
**Prompt Used:** This is how the workflow should continue. The user chooses 1 or more hotels from the provided list. Based on the chosen hotels and their Ids another tool will call the liteAPI `/hotels/rates` endpoint. This endpoint requires the following mandatory payload:
- hotelIds: array
- occupanices: object { adults: number, children: number }
- currency: Assume USD (for now)
- guestNationality: Assume US (for now)
- checkin: string (needs to be requested by the agent and specified by the user)
- checkout: string (needs to be requested by the agent and specified by the user)
The liteAPI endpoint is of type POST and accepts body in json format
Please also instruct the agent to request the necessary information for the tool: number of adults/children(optionally), checkin date, checkout date.
**Output Quality:** Decent
**Modifications Made:** Minor, but took quite some time because I missread the necessary payload and spent some time debugging. It needs an array of the ages of the children and not the number of childrens

### 5. Tool Implementation - Search hotels
**Task:** Last step: prebook and book the hotel
**Prompt Used:** Let's get to the next tool needed and that would be the booking tool. From the available rates the user should select a room. Each room type has an offerId that needs to be used for the booking.
The liteAPI endpoint for pre booking is `rates/prebook`. It needs an offerId
Next liteAPI endpoint for booking is `rates/book`. It needs:
- a prebookId from previous step
- a holder object with firstName, lastName, email, phone
- a guest array of objects with firstName, lastName, email, phone (principal guest for each room)
Instruct the agent to also request the necessary details for the booking after selecting a room.
**Output Quality:** Decent
**Modifications Made:** Minor, but my prompt was not very specific

### 6. Add types/interfaces
**Task:** Objective is to take advantage of typescript and let the AI generate it
**Prompt Used:** Leverage TypeScript's static typing (e.g., use interfaces, generics, type inference) across the entire codebase. (Provided for each endpoint the response schema)
**Output Quality:** Decent
**Modifications Made:** Changed some namings but overall minor modifications
