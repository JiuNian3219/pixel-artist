import { Flex, Spin, type FlexProps } from "antd";

interface CenterSpinProps extends FlexProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * 居中加载中 Spin 组件
 */
const CenterSpin: React.FC<CenterSpinProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      style={style}
      {...rest}
    >
      <Spin>{children}</Spin>
    </Flex>
  );
};

export default CenterSpin;
