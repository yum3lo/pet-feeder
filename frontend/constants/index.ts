import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const NAVBAR_BASE = 12 + 26 + 4 + 18; // padding + icon size + spacing + label height

export * from './cache';