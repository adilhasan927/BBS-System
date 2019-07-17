import { Post } from './post';

describe('Post', () => {
  it('should create an instance', () => {
    expect(new Post('id', 'username', 'body')).toBeTruthy();
  });
});
