import { describe, it, expect } from 'vitest';
import { generateExampleFromAPIRequestSchema } from '../lib/generateExampleFromAPIRequestSchema';
import { APIRequestSchema } from '../types';

describe('generateExampleFromAPIRequestSchema', () => {
  it('should return the example when it exists', () => {
    const schema: APIRequestSchema = {
      type: 'string',
      example: 'example-value'
    };
    
    expect(generateExampleFromAPIRequestSchema(schema)).toBe('example-value');
  });
  
  it('should return the first enum value when enum exists', () => {
    const schema: APIRequestSchema = {
      type: 'string',
      enum: ['option1', 'option2', 'option3']
    };
    
    expect(generateExampleFromAPIRequestSchema(schema)).toBe('option1');
  });
  
  it('should handle array types by returning an array with one example item', () => {
    const schema: APIRequestSchema = {
      type: 'array',
      items: {
        type: 'string',
        example: 'item-example'
      }
    };
    
    expect(generateExampleFromAPIRequestSchema(schema)).toEqual(['item-example']);
  });

  it('should handle nested array types', () => {
    const schema: APIRequestSchema = {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'string',
          example: 'nested-item'
        }
      }
    };
    
    expect(generateExampleFromAPIRequestSchema(schema)).toEqual([['nested-item']]);
  });
  
  it('should handle object types with properties', () => {
    const schema: APIRequestSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe'
        },
        age: {
          type: 'integer',
          example: 30
        },
        isActive: {
          type: 'boolean',
          example: true
        }
      }
    };
    
    expect(generateExampleFromAPIRequestSchema(schema)).toEqual({
      name: 'John Doe',
      age: 30,
      isActive: true
    });
  });
  
  it('should handle nested object types', () => {
    const schema: APIRequestSchema = {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            contact: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  example: 'john@example.com'
                }
              }
            }
          }
        }
      }
    };
    
    expect(generateExampleFromAPIRequestSchema(schema)).toEqual({
      user: {
        name: 'John Doe',
        contact: {
          email: 'john@example.com'
        }
      }
    });
  });
  
  it('should return an empty object if type is missing or unsupported', () => {
    const schemaWithoutType: APIRequestSchema = {
      description: 'A schema without type'
    };
    
    expect(generateExampleFromAPIRequestSchema(schemaWithoutType)).toEqual({});
  });

  it('should handle properties with missing examples', () => {
    const schema: APIRequestSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe'
        },
        description: {
          type: 'string'
          // No example
        }
      }
    };
    
    const result = generateExampleFromAPIRequestSchema(schema);
    expect(result).toHaveProperty('name', 'John Doe');
    expect(result).toHaveProperty('description');
    // Since description doesn't have an example, it will fallback to an empty object
    expect(result.description).toEqual({});
  });
});

// Keep these tests for future implementation
describe("generateCodeSnippetsFromAPIRequests", () => {
  it.todo("should generate all fdi examples without error");
  it.todo("should generate all cdi examples with correct indentation");
});
