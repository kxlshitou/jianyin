import { Asset, AssetType, Track } from './types';

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'v1',
    type: AssetType.VIDEO,
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    name: 'Flower Blooming',
    duration: 5,
    thumbnail: 'https://picsum.photos/id/20/100/100'
  },
  {
    id: 'i1',
    type: AssetType.IMAGE,
    src: 'https://picsum.photos/id/10/800/600',
    name: 'Forest Mist',
    duration: 3,
    thumbnail: 'https://picsum.photos/id/10/100/100'
  },
  {
    id: 'i2',
    type: AssetType.IMAGE,
    src: 'https://picsum.photos/id/15/800/600',
    name: 'Waterfall',
    duration: 3,
    thumbnail: 'https://picsum.photos/id/15/100/100'
  }
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-main',
    type: 'MAIN',
    clips: []
  },
  {
    id: 'track-text',
    type: 'TEXT',
    clips: []
  },
  {
    id: 'track-audio',
    type: 'AUDIO',
    clips: []
  }
];