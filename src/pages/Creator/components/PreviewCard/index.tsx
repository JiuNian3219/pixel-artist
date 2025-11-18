import { useTranslation } from "react-i18next";
import styles from "./index.module.less";

interface PreviewCardProps {
  value: string;
  onChange: (paletteId: string) => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ value, onChange }) => {
  const { t } = useTranslation("creator");

  return <div className={styles.previewCard}></div>;
};

export default PreviewCard;
