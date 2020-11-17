const { Fetcher } = require('../../')
test('get usage test', async () => {
  const fetcher = new Fetcher({ timeout: 2000 })

  const rs = await fetcher.get('https://www.yy.com/yyweb/module/data/header')
  expect(rs).not.toEqual({})
})

test('post usage test', async () => {
  const fetcher = new Fetcher({ timeout: 2000 })

  const rs = await fetcher.post('https://www.yy.com/yyweb/module/data/header')
  expect(rs).not.toEqual({})
})
