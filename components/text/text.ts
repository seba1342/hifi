export const textBaseStyle = {
  // Prevents a dark shadow being added to all text elements
  textShadowColor: "transparent",
  textShadowRadius: 0,
  // Ensures both Android and iOS use the intended font file rather than
  // auto-selecting based on fontWeight (happens in react-navigation headers)
  fontWeight: undefined,
  fontFamily: "CircularStdBook",
} as const;
