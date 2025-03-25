
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent } from './agents';
import { hotelAgent } from './agents/hotel-booking';

export const mastra = new Mastra({
  agents: { weatherAgent, hotelAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
