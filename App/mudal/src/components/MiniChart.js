import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import colors from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Lightweight SVG line chart component
 * @param {Array<number>} data - Array of numeric values
 * @param {number} width - Chart width
 * @param {number} height - Chart height
 * @param {string} lineColor - Stroke color
 * @param {boolean} showFill - Show gradient fill below line
 */
const MiniChart = ({
  data = [],
  width = SCREEN_WIDTH - 80,
  height = 120,
  lineColor,
  showFill = true,
  strokeWidth = 2.5,
  style,
}) => {
  if (data.length < 2) return null;

  const color = lineColor || colors.primary;
  const padding = { top: 10, bottom: 10, left: 0, right: 0 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((val - minVal) / range) * chartHeight,
  }));

  // Build smooth cubic bezier path
  const buildPath = () => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const linePath = buildPath();
  const fillPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        {showFill && (
          <Path d={fillPath} fill="url(#chartGradient)" />
        )}
        <Path
          d={linePath}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default MiniChart;
