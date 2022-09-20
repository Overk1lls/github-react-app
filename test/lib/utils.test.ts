import { createRequest } from 'node-mocks-http';
import { getPaginateParamsFromQuery } from '../../src/lib/utils';

describe('/lib/Utils', () => {
  it('test with skip & limit undefined', () => {
    const req = createRequest();
    const result = getPaginateParamsFromQuery(req);

    expect(result).toEqual(
      expect.objectContaining({
        skip: undefined,
        limit: undefined,
      })
    );
  });

  it('test with skip undefined', () => {
    const req = createRequest({
      query: {
        limit: 1,
      },
    });
    const result = getPaginateParamsFromQuery(req);

    expect(result).toEqual(
      expect.objectContaining({
        limit: 1,
        skip: undefined,
      })
    );
  });

  it('test with limit undefined', () => {
    const req = createRequest({
      query: {
        skip: 1,
      },
    });
    const result = getPaginateParamsFromQuery(req);

    expect(result).toEqual(
      expect.objectContaining({
        skip: 1,
        limit: undefined,
      })
    );
  });
});
