# Demo Data

This folder contains all demo and sample data used for testing and development of the proxy shopping platform.

## Files

### `/demo-accounts.ts`
- **Purpose**: Demo user accounts with various verification states
- **Contains**: 7 demo users with different verification levels and credit cards
- **Key Users**:
  - `e1@gmail.com` (Allison Gonzalez) - Has 3 product offers
  - `e2@gmail.com` (Ethan O'Neill) - Has 2 product requests
  - Plus 5 additional demo users for variety
- **Note**: Capabilities field removed - all users can be both clients and agents

### `/demo-offers.ts`
- **Purpose**: Product offers specifically created by demo accounts
- **Contains**: 3 professional product offers from Allison Gonzalez
- **Products**: MacBook Pro, Herman Miller Chair, Dell Monitor Setup
- **Uses**: Proper UUID relationships with demo accounts
- **Format**: estimatedDelivery uses `{ start: number, end: number, unit: 'days' }` format

### `/demo-requests.ts`
- **Purpose**: Shopping requests specifically created by demo accounts
- **Contains**: 2 industrial/construction requests from Ethan O'Neill
- **Products**: Makita Power Tools, 3M Safety Equipment
- **Uses**: Proper UUID relationships with demo accounts
- **Format**: expectedDelivery uses `{ start: number, end: number, unit: 'days' }` format

### `/sample-offers.ts`
- **Purpose**: Additional sample offers for app variety and testing
- **Contains**: 6 main sample offers + 2 additional offers
- **Categories**: Electronics, Fashion, Beauty, Luxury, Food
- **Agents**: Distributed among Emma Chen, Sophie Mueller, Marcus Johnson
- **Format**: estimatedDelivery uses `{ start: number, end: number, unit: 'days' }` format

## Usage

These files are imported by:
- `/services/seedData.ts` - Populates the IndexedDB with demo data
- `/services/userService.ts` - Demo account authentication

## Data Relationships

All demo data uses proper UUID relationships:
- Demo accounts have unique UUIDs as IDs
- Demo offers reference agent IDs via UUIDs
- Demo requests reference client IDs via UUIDs
- Sample offers are assigned to demo users during seeding

## Development Notes

- All UUIDs are semantic for easy debugging
- Data includes realistic information for testing
- Credit card numbers are test numbers only
- Phone numbers and addresses are fictional