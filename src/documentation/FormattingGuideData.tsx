export interface GuideItem {
  title: string;
  code: string;
}

const FormattingGuideData: Array<GuideItem> = [
  {
    title: 'Metadata',
    code: 'title: The Comic Title'
  },
  {
    title: 'Page',
    code: 'page'
  },
  {
    title: 'Panel',
    code: 'panel'
  },
  {
    title: 'Dialogue',
    code: '<tab>Mao: I have robot parts.'
  },
  {
    title: 'SFX',
    code: '<tab>sfx: BLAM'
  },
  {
    title: 'Caption',
    code: '<tab>caption: Once upon a wasteland...'
  },
  {
    title: 'Bold',
    code: '**bold dialogue**'
  }
]

export default FormattingGuideData;
