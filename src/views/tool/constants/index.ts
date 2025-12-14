export const QUESTIONS: Question[] = [
  {
    index: 1,
    content: '您觉得工作、生活和人际关系中哪个给您的压力更大？',
    type: 'select',
    options: [
      { label: '业务', value: '1' },
      { label: '生活', value: '2' },
      { label: '人际关系', value: '3' }
    ]
  },
  {
    index: 2,
    content: '您在生活中通过什么样的方式缓解压力？做什么最让您感到幸福？',
    type: 'select',
    options: [
      { label: '户外活动', value: '1' },
      { label: '个人休息', value: '2' },
      { label: '聚餐', value: '3' },
      { label: '其他', value: '4' }
    ]
  },
  {
    index: 3,
    content: '您更喜欢户外活动还是室内活动？',
    type: 'select',
    options: [
      { label: '户外活动', value: '1' },
      { label: '室内活动', value: '2' }
    ]
  },
  {
    index: 4,
    content: '是否想和更多同事熟悉？想通过怎样的方式？',
    type: 'select',
    options: [
      { label: 'Work shop', value: '1' },
      { label: '同好会，户外活动，生日会', value: '2' },
      { label: '聚餐', value: '3' },
      { label: '其他', value: '4' }
    ]
  },
  {
    index: 5,
    content: '您认为参加公司活动的最佳频率是？',
    type: 'select',
    options: [
      { label: '每月一次', value: '1' },
      { label: '每两月一次', value: '2' },
      { label: '每季度一次', value: '3' },
      { label: '不定期按需组织', value: '4' }
    ]
  },
  {
    index: 6,
    content: '您是否愿意参加公司组织的活动拉近同事间的人际关系及缓解压力？',
    type: 'select',
    options: [
      { label: '愿意', value: '1' },
      { label: '不愿意', value: '2' }
    ]
  },
  {
    index: 7,
    content: '节日您希望收到什么类型的礼物？',
    type: 'select',
    options: [
      { label: '京东卡', value: '1' },
      { label: '公司选好的礼盒套装', value: '2' },
      { label: 'fesco福利网等可自选兑换礼物方式', value: '3' }
    ]
  },
  {
    index: 8,
    content: '您认为在今年举办的活动当中，最吸引您的原因是什么？',
    type: 'select',
    options: [
      { label: '活动主题', value: '1' },
      { label: '活动礼物', value: '2' },
      { label: '与同事之间的互动', value: '3' },
      { label: '其他', value: '4' }
    ]
  },
  {
    index: 9,
    content: '您对限定活动名额的看法是？',
    type: 'select',
    options: [
      { label: '名额经常不够，希望增加名额，让更多人有机会参与', value: '1' },
      { label: '理解并接受名额限定，报上就参加，报不上也无所谓', value: '2' },
      { label: '我对活动不感兴趣，不关心名额多少', value: '3' },
      { label: '其他', value: '4' }
    ]
  },
  {
    index: 10,
    content:
      '为了帮助员工更好地放松身心、缓解压力，您希望公司明年举办哪种类型的活动？请具体举例说明（例如：1.手工diy类 2.拍摄记录类 3.体育锻炼…）',
    type: 'text'
  },
  {
    index: 11,
    content: '在您参加的活动中，哪一个环节或瞬间让您印象深刻？请简要描述原因',
    type: 'text'
  },
  {
    index: 12,
    content:
      '请留下您对于明年员工关怀或活动组织的任何宝贵建议（可以是具体的活动主题或奖品礼物类型等等）',
    type: 'text'
  },
  {
    index: 13,
    content:
      '您认为参加公司活动对缓解工作压力、提升工作幸福感的作用有多大？（0~10分）',
    type: 'select',
    options: [
      { label: '10', value: '1' },
      { label: '8', value: '2' },
      { label: '6', value: '3' },
      { label: '4', value: '4' }
    ]
  },
  {
    index: 14,
    content:
      '为了明年的活动举办的更好，您认为今年的活动举办过程中有哪些优点或不足需要改进的地方？（请举例）',
    type: 'text'
  },
  {
    index: 15,
    content: '希望社团活动组织什么类型，有什么改善建议',
    type: 'text'
  }
]
