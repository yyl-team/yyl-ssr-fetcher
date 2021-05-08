const { Fetcher } = require('../../')
test('get usage test', async () => {
  const fetcher = new Fetcher({ timeout: 2000 })

  const rs = await fetcher.get('https://9u9ntpb8xp.api.quickmocker.com/getter-test')
  expect(rs).not.toEqual({})
})

test('post usage test', async () => {
  const fetcher = new Fetcher({ timeout: 2000 })

  const rs = await fetcher.post('https://9u9ntpb8xp.api.quickmocker.com/getter-test')
  expect(rs).not.toEqual({})
})
