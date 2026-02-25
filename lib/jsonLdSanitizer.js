const MALFORMED_SITE_PREFIX = /^https?:\/\/www\.kashitaxi\.in(https?:\/\/.+)$/i;

const isPlainObject = (value) => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
);

const isNonEmptyString = (value) => (
  typeof value === 'string'
  && value.trim().length > 0
);

const normalizeStringValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  const malformedMatch = trimmed.match(MALFORMED_SITE_PREFIX);
  if (malformedMatch) {
    return malformedMatch[1];
  }

  return trimmed;
};

const hasEventType = (node) => {
  const schemaType = node?.['@type'];
  if (Array.isArray(schemaType)) {
    return schemaType.includes('Event');
  }
  return schemaType === 'Event';
};

const hasValidLocation = (location) => {
  if (isNonEmptyString(location)) {
    return true;
  }

  if (!isPlainObject(location)) {
    return false;
  }

  return (
    isNonEmptyString(location.name)
    || isNonEmptyString(location['@id'])
    || isNonEmptyString(location.url)
    || isPlainObject(location.address)
  );
};

const isValidDateValue = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
};

const isValidEventNode = (node) => (
  isNonEmptyString(node.name)
  && isValidDateValue(node.startDate)
  && hasValidLocation(node.location)
);

const sanitizeNode = (node) => {
  if (Array.isArray(node)) {
    return node
      .map((entry) => sanitizeNode(entry))
      .filter((entry) => entry !== null && entry !== undefined);
  }

  if (isPlainObject(node)) {
    const sanitizedNode = {};

    Object.entries(node).forEach(([key, value]) => {
      const sanitizedValue = sanitizeNode(value);

      if (sanitizedValue === null || sanitizedValue === undefined) {
        return;
      }

      if (Array.isArray(sanitizedValue) && sanitizedValue.length === 0) {
        return;
      }

      sanitizedNode[key] = sanitizedValue;
    });

    if (hasEventType(sanitizedNode)) {
      if (!isValidEventNode(sanitizedNode)) {
        return null;
      }

      if (isNonEmptyString(sanitizedNode.endDate) && !isValidDateValue(sanitizedNode.endDate)) {
        delete sanitizedNode.endDate;
      }
    }

    return sanitizedNode;
  }

  if (typeof node === 'string') {
    return normalizeStringValue(node);
  }

  return node;
};

export function sanitizeJsonLdData(jsonLdData) {
  if (!jsonLdData || typeof jsonLdData !== 'object') {
    return jsonLdData;
  }

  const sanitized = sanitizeNode(jsonLdData);
  if (!sanitized || typeof sanitized !== 'object') {
    return {
      '@context': 'https://schema.org',
      '@graph': [],
    };
  }

  if (Array.isArray(sanitized['@graph'])) {
    sanitized['@graph'] = sanitized['@graph'].filter(Boolean);
  }

  if (!sanitized['@context']) {
    sanitized['@context'] = 'https://schema.org';
  }

  return sanitized;
}
