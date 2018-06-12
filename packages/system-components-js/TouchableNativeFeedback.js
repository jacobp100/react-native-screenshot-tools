const TouchableNativeFeedback = p => p.children;

TouchableNativeFeedback.SelectableBackground = () => null;
TouchableNativeFeedback.SelectableBackgroundBorderless = () => null;
TouchableNativeFeedback.Ripple = () => null;
TouchableNativeFeedback.canUseNativeForeground = () => true;

export default TouchableNativeFeedback;
