import { getQueryVariables } from '../router';

describe('query permutations', () => {
    it('returns a single query as an object with key/string', () => {
        const result = getQueryVariables('template=test');
        expect(result).toHaveProperty('template', 'test');
    });
    it('returns 2 different queries with 2 keys', () => {
        const result = getQueryVariables('template=test&foo=bar');
        expect(result).toHaveProperty('template', 'test');
        expect(result).toHaveProperty('foo', 'bar');
    });
    it('returns an array when queries are repeated', () => {
        const result = getQueryVariables(
            'template=test&template=test2&foo=bar'
        );
        console.log(result);
        expect(result).toHaveProperty('template');
        expect(result.template).toHaveLength(2);
        expect(result.template[0]).toBe('test');
        expect(result.template[1]).toBe('test2');
        expect(result).toHaveProperty('foo', 'bar');
    });
});
