import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useBreakpoint } from '../lib/useBreakpoint';

interface Props {
  children: React.ReactNode;
  maxWidth?: number;
  style?: ViewStyle;
}

export function PageContainer({ children, maxWidth = 880, style }: Props) {
  const { isDesktop } = useBreakpoint();

  if (!isDesktop) return <>{children}</>;

  return (
    <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
      <View style={[{ width: '100%', maxWidth, flex: 1 }, style]}>
        {children}
      </View>
    </View>
  );
}
