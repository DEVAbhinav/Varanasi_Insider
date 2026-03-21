import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import * as z from 'zod/v4';
import leadCapture from '../lib/lead-capture.js';

const { submitLeadCapture } = leadCapture;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const knowledgeBasePath = path.join(__dirname, '..', 'data', 'assistant', 'knowledge_base.json');
const knowledgeBase = JSON.parse(readFileSync(knowledgeBasePath, 'utf8'));
const routeKeys = Object.keys(knowledgeBase.routes || {});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const widgetPath = '/chatgpt-app/quote-widget';

function getNestedValue(source, dottedPath) {
  return dottedPath.split('.').reduce((current, key) => current?.[key], source);
}

function humanizeKey(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function flattenKnowledge(node, prefix = '', rows = []) {
  if (Array.isArray(node)) {
    node.forEach((value, index) => {
      flattenKnowledge(value, `${prefix}[${index}]`, rows);
    });
    return rows;
  }

  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([key, value]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flattenKnowledge(value, nextPrefix, rows);
    });
    return rows;
  }

  rows.push({
    path: prefix,
    value: node,
    text: `${prefix}: ${String(node)}`.toLowerCase(),
  });
  return rows;
}

function searchKnowledgeBase(query, section) {
  const root = section ? getNestedValue(knowledgeBase, section) : knowledgeBase;
  if (!root) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();
  const rows = flattenKnowledge(root);

  return rows
    .filter((row) => row.text.includes(normalizedQuery))
    .slice(0, 8)
    .map((row) => ({
      path: row.path,
      value: row.value,
      preview: typeof row.value === 'string' ? row.value : JSON.stringify(row.value),
    }));
}

function recommendVehicle(groupSize, luggageBags, tripType) {
  const vehicles = knowledgeBase.vehicles;
  const normalizedTripType = String(tripType || '').toLowerCase();
  const wantsLongTrip = ['outstation', 'airport', 'pilgrimage', 'group'].includes(normalizedTripType);

  let key = 'cars.sedan';
  if (groupSize >= 13) {
    key = 'vehicles.tempo_travellers.17_seater';
  } else if (groupSize >= 8) {
    key = 'vehicles.tempo_travellers.12_seater';
  } else if (groupSize >= 6 || luggageBags >= 5) {
    key = 'vehicles.cars.suv';
  } else if (groupSize >= 4 || luggageBags >= 4) {
    key = 'vehicles.cars.mini_suv';
  } else if (wantsLongTrip) {
    key = 'vehicles.cars.premium_suv';
  } else {
    key = 'vehicles.cars.sedan';
  }

  const details = getNestedValue(knowledgeBase, key);

  return {
    key,
    label: humanizeKey(key.split('.').at(-1)),
    details,
  };
}

function getRouteQuote(routeKey, vehicleType) {
  const route = knowledgeBase.routes?.[routeKey];
  if (!route) {
    return null;
  }

  const normalizedVehicle = String(vehicleType || '').trim().toLowerCase();
  const pricingEntries = Object.entries(route.pricing || {});

  const matchedPricing = normalizedVehicle
    ? pricingEntries.filter(([key]) => key.includes(normalizedVehicle))
    : pricingEntries;

  return {
    routeKey,
    title: humanizeKey(routeKey),
    distanceKm: route.distance_km,
    durationHours: route.duration_hours,
    via: route.via,
    recommendedDeparture: route.recommended_departure,
    keyStops: route.key_stops || [],
    pricing: Object.fromEntries(matchedPricing),
    rules: route.rules || {},
  };
}

function buildWidgetHtml() {
  const widgetUrl = `${siteUrl}${widgetPath}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Varanasi Insider Quote Widget</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f5f7fb; color: #122033; }
      .card { max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 24px; box-shadow: 0 10px 30px rgba(18, 32, 51, 0.08); }
      h1 { margin: 0 0 12px; font-size: 24px; }
      p { line-height: 1.5; margin: 0 0 12px; }
      a { color: #0f766e; font-weight: 700; }
      iframe { width: 100%; min-height: 760px; border: 1px solid #dbe4f0; border-radius: 16px; background: #fff; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Lead Capture Widget</h1>
      <p>This reuses the existing website sidebar booking flow so ChatGPT users can hand off a lead to your operator.</p>
      <p>If your client does not render inline HTML, open <a href="${widgetUrl}" target="_blank" rel="noopener noreferrer">${widgetUrl}</a>.</p>
      <iframe src="${widgetUrl}" title="Booking Widget"></iframe>
    </div>
  </body>
</html>`;
}

function createServer() {
  const server = new McpServer(
    {
      name: 'varanasi-insider-chatgpt-app',
      version: '0.1.0',
    },
    {
      capabilities: {
        logging: {},
      },
    }
  );

  server.registerTool(
    'search_knowledge_base',
    {
      title: 'Search Knowledge Base',
      description: 'Use this when you need exact business facts, pricing snippets, timings, or policy details from the Varanasi Insider travel database.',
      inputSchema: {
        query: z.string().min(2).describe('Keyword or phrase to search for.'),
        section: z.string().optional().describe('Optional top-level or dotted path to narrow the search, such as routes or festivals.maha_shivaratri.'),
      },
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async ({ query, section }) => {
      const matches = searchKnowledgeBase(query, section);

      return {
        content: [
          {
            type: 'text',
            text: matches.length
              ? `Found ${matches.length} matches for "${query}".`
              : `No matches found for "${query}".`,
          },
        ],
        structuredContent: {
          query,
          section: section || null,
          matches,
        },
      };
    }
  );

  server.registerTool(
    'get_vehicle_recommendation',
    {
      title: 'Get Vehicle Recommendation',
      description: 'Use this when you need a practical vehicle suggestion based on group size, luggage, and trip shape.',
      inputSchema: {
        groupSize: z.number().int().min(1).max(25).describe('Total travelers.'),
        luggageBags: z.number().int().min(0).max(30).default(0).describe('Approximate luggage count.'),
        tripType: z.enum(['local', 'airport', 'outstation', 'pilgrimage', 'group']).default('local'),
      },
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async ({ groupSize, luggageBags, tripType }) => {
      const recommendation = recommendVehicle(groupSize, luggageBags, tripType);

      return {
        content: [
          {
            type: 'text',
            text: `Recommended vehicle: ${recommendation.label}.`,
          },
        ],
        structuredContent: {
          inputs: { groupSize, luggageBags, tripType },
          recommendation,
        },
      };
    }
  );

  server.registerTool(
    'get_route_quote',
    {
      title: 'Get Route Quote',
      description: 'Use this when you need a route summary and indicative pricing for one of the supported Varanasi routes.',
      inputSchema: {
        routeKey: z.string().describe(`Route key. Supported values include: ${routeKeys.join(', ')}.`),
        vehicleType: z.string().optional().describe('Optional pricing filter such as sedan, suv, tempo_12, or tempo_17.'),
      },
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async ({ routeKey, vehicleType }) => {
      const route = getRouteQuote(routeKey, vehicleType);

      if (!route) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown route "${routeKey}".`,
            },
          ],
          structuredContent: {
            routeKey,
            availableRouteKeys: routeKeys,
          },
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `${route.title}: ${route.distanceKm} km, ${route.durationHours} hours.`,
          },
        ],
        structuredContent: route,
      };
    }
  );

  server.registerTool(
    'submit_booking_lead',
    {
      title: 'Submit Booking Lead',
      description: 'Use this when the user wants to hand off a real booking inquiry to the operator for follow-up.',
      inputSchema: {
        name: z.string().min(2).describe('Traveler name.'),
        phone: z.string().min(10).describe('Traveler phone or WhatsApp number.'),
        email: z.string().email().optional().describe('Optional email address.'),
        passengers: z.string().optional().describe('Passenger count summary, for example 4 or 5-6.'),
        tripType: z.string().default('ChatGPT App Inquiry'),
        pickupLocation: z.string().optional(),
        destination: z.string().optional(),
        pickupDate: z.string().optional().describe('Travel date in YYYY-MM-DD format if known.'),
        message: z.string().optional().describe('Extra notes from the traveler.'),
        source: z.string().default('ChatGPT App'),
      },
      annotations: {
        destructiveHint: true,
        idempotentHint: false,
      },
    },
    async (input) => {
      const lead = await submitLeadCapture(input);

      return {
        content: [
          {
            type: 'text',
            text: 'Lead captured and ready for operator follow-up.',
          },
        ],
        structuredContent: lead,
      };
    }
  );

  server.registerResource(
    'quote-widget',
    'ui://varanasi-insider/quote-widget.html',
    {
      mimeType: 'text/html',
      description: 'A reusable lead-capture widget that mirrors the website sidebar booking form.',
    },
    async () => ({
      contents: [
        {
          uri: 'ui://varanasi-insider/quote-widget.html',
          mimeType: 'text/html',
          text: buildWidgetHtml(),
        },
      ],
    })
  );

  return server;
}

const host = process.env.MCP_HOST || '127.0.0.1';
const port = Number(process.env.MCP_PORT || 8787);
const allowedHosts = process.env.MCP_ALLOWED_HOSTS
  ? process.env.MCP_ALLOWED_HOSTS.split(',').map((value) => value.trim()).filter(Boolean)
  : undefined;
const app = createMcpExpressApp({ host, allowedHosts });

app.get('/', (_req, res) => {
  res.json({
    name: 'varanasi-insider-chatgpt-app',
    endpoint: '/mcp',
    widgetUrl: `${siteUrl}${widgetPath}`,
    supportedRoutes: routeKeys,
  });
});

app.post('/mcp', async (req, res) => {
  const server = createServer();

  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

    res.on('close', () => {
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.get('/mcp', (_req, res) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not allowed.',
    },
    id: null,
  });
});

app.delete('/mcp', (_req, res) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not allowed.',
    },
    id: null,
  });
});

app.listen(port, host, (error) => {
  if (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }

  console.log(`VSI MCP server listening at http://${host}:${port}/mcp`);
});
