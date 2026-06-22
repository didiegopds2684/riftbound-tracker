import { useWindowDimensions } from 'react-native';

export const DESKTOP_BREAKPOINT = 960;

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return { isDesktop: width >= DESKTOP_BREAKPOINT };
}
