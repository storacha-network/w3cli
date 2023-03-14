import test from 'ava'
import * as CID from 'multiformats/cid'
import {
  filesize,
  uploadListResponseToString,
  storeListResponseToString
} from '../lib.js'

test('filesize', t => {
  [
    [5, '5B'],
    [50, '0.1KB'],
    [500, '0.5KB'],
    [5_000, '5.0KB'],
    [50_000, '0.1MB'],
    [500_000, '0.5MB'],
    [5_000_000, '5.0MB'],
    [50_000_000, '0.1GB'],
    [500_000_000, '0.5GB'],
    [5_000_000_000, '5.0GB']
  ].forEach(([size, str]) => t.is(filesize(size), str))
})

const uploadListResponse = {
  size: 2,
  cursor: 'bafybeibvbxjeodaa6hdqlgbwmv4qzdp3bxnwdoukay4dpl7aemkiwc2eje',
  results: [
    {
      root: CID.fromJSON({ '/': 'bafybeia7tr4dgyln7zeyyyzmkppkcts6azdssykuluwzmmswysieyadcbm' }),
      shards: [CID.fromJSON({ '/': 'bagbaierantza4rfjnhqksp2stcnd2tdjrn3f2kgi2wrvaxmayeuolryi66fq' })],
      updatedAt: '2023-02-13T16:29:48.520Z',
      insertedAt: '2023-02-13T16:27:36.451Z'
    },
    {
      root: CID.fromJSON({ '/': 'bafybeibvbxjeodaa6hdqlgbwmv4qzdp3bxnwdoukay4dpl7aemkiwc2eje' }),
      shards: [CID.fromJSON({ '/': 'bagbaieraxqbkzwvx5on6an4br5hagfgesdfc6adchy3hf5qt34pupfjd3rbq' })],
      updatedAt: '2023-02-13T16:30:22.086Z',
      insertedAt: '2023-02-13T16:30:22.086Z'
    }
  ],
  after: 'bafybeibvbxjeodaa6hdqlgbwmv4qzdp3bxnwdoukay4dpl7aemkiwc2eje',
  before: 'bafybeia7tr4dgyln7zeyyyzmkppkcts6azdssykuluwzmmswysieyadcbm'
}

test('uploadListResponseToString can return the upload roots CIDs as strings', (t) => {
  t.is(
    uploadListResponseToString(uploadListResponse, {}),
    `bafybeia7tr4dgyln7zeyyyzmkppkcts6azdssykuluwzmmswysieyadcbm
bafybeibvbxjeodaa6hdqlgbwmv4qzdp3bxnwdoukay4dpl7aemkiwc2eje`
  )
})

test('uploadListResponseToString can return the upload roots as newline delimited JSON', (t) => {
  t.is(
    uploadListResponseToString(uploadListResponse, { shards: true }),
    `bafybeia7tr4dgyln7zeyyyzmkppkcts6azdssykuluwzmmswysieyadcbm
└─┬ shards
  └── bagbaierantza4rfjnhqksp2stcnd2tdjrn3f2kgi2wrvaxmayeuolryi66fq

bafybeibvbxjeodaa6hdqlgbwmv4qzdp3bxnwdoukay4dpl7aemkiwc2eje
└─┬ shards
  └── bagbaieraxqbkzwvx5on6an4br5hagfgesdfc6adchy3hf5qt34pupfjd3rbq
`
  )
})

test('uploadListResponseToString can return the upload roots and shards as a tree', (t) => {
  t.is(
    uploadListResponseToString(uploadListResponse, { json: true }),
    `{"root":"bafybeia7tr4dgyln7zeyyyzmkppkcts6azdssykuluwzmmswysieyadcbm","shards":["bagbaierantza4rfjnhqksp2stcnd2tdjrn3f2kgi2wrvaxmayeuolryi66fq"]}
{"root":"bafybeibvbxjeodaa6hdqlgbwmv4qzdp3bxnwdoukay4dpl7aemkiwc2eje","shards":["bagbaieraxqbkzwvx5on6an4br5hagfgesdfc6adchy3hf5qt34pupfjd3rbq"]}`
  )
})

const storeListResponse = {
  size: 2,
  cursor: 'bagbaieracmkgwrw6rowsk5jse5eihyhszyrq5w23aqosajyckn2tfbotdcqq',
  results: [
    { link: CID.fromJSON({ '/': 'bagbaierablvu5d2q5uoimuy2tlc3tcntahnw2j7s7jjaznawc23zgdgcisma' }), size: 5336, insertedAt: '2023-02-13T10:57:23.274Z' },
    { link: CID.fromJSON({ '/': 'bagbaieracmkgwrw6rowsk5jse5eihyhszyrq5w23aqosajyckn2tfbotdcqq' }), size: 3297, insertedAt: '2023-02-13T16:30:02.077Z' }
  ],
  after: 'bagbaieracmkgwrw6rowsk5jse5eihyhszyrq5w23aqosajyckn2tfbotdcqq',
  before: 'bagbaierablvu5d2q5uoimuy2tlc3tcntahnw2j7s7jjaznawc23zgdgcisma'
}

test('storeListResponseToString can return the CAR CIDs as strings', (t) => {
  t.is(
    storeListResponseToString(storeListResponse, {}),
    `bagbaierablvu5d2q5uoimuy2tlc3tcntahnw2j7s7jjaznawc23zgdgcisma
bagbaieracmkgwrw6rowsk5jse5eihyhszyrq5w23aqosajyckn2tfbotdcqq`
  )
})

test('storeListResponseToString can return the CAR CIDs as newline delimited JSON', (t) => {
  t.is(
    storeListResponseToString(storeListResponse, { json: true }),
    `{"link":"bagbaierablvu5d2q5uoimuy2tlc3tcntahnw2j7s7jjaznawc23zgdgcisma","size":5336,"insertedAt":"2023-02-13T10:57:23.274Z"}
{"link":"bagbaieracmkgwrw6rowsk5jse5eihyhszyrq5w23aqosajyckn2tfbotdcqq","size":3297,"insertedAt":"2023-02-13T16:30:02.077Z"}`
  )
})
