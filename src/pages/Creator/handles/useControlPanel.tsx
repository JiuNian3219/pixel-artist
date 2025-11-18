import { useCreatorLocalStore } from "@/stores";
import { getPixelAlgorithmsOptions } from "@/utils/algorithm";
import { pixelateImage } from "@/utils/pixelate";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface UseControlPanelProps {
  setOriginalFile: (file: File | null) => void;
  setPixelatedImage: (url: string) => void;
}

const useControlPanel = ({
  setOriginalFile,
  setPixelatedImage,
}: UseControlPanelProps) => {
  const pixelSize = useCreatorLocalStore((state) => state.pixelSize);
  const setPixelSize = useCreatorLocalStore((state) => state.setPixelSize);
  const pixelAlgorithm = useCreatorLocalStore((state) => state.pixelAlgorithm);
  const setPixelAlgorithm = useCreatorLocalStore(
    (state) => state.setPixelAlgorithm
  );
  const paletteName = useCreatorLocalStore((state) => state.paletteName);
  const setPaletteName = useCreatorLocalStore((state) => state.setPaletteName);
  const extendMode = useCreatorLocalStore((state) => state.extendMode);

  const [originalImage, setOriginalImage] = useState<string>("");
  const [inPixelation, setInPixelation] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { t } = useTranslation("creator");
  const pixelAlgorithmOptions = getPixelAlgorithmsOptions(t);

  const handlePaletteChange = (paletteName: string) => {
    setPaletteName(paletteName);
  };

  const handleChangePixelSize = (value: number) => {
    setPixelSize(value);
  };

  const handlePixelAlgorithmChange = (value: string) => {
    setPixelAlgorithm(value);
  };

  const handleImageChange = (file: File | null, url: string) => {
    setImageFile(file);
    setOriginalFile(file);
    setOriginalImage(url);
    setPixelatedImage("");
  };

  // 处理像素化转换
  const handlePixelate = () => {
    if (!imageFile || !originalImage) return;
    setInPixelation(true);

    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const pixelatedData = pixelateImage(
        data,
        width,
        height,
        pixelSize,
        pixelAlgorithm,
        paletteName
      );

      const newImageData = new ImageData(pixelatedData, width, height);
      ctx.putImageData(newImageData, 0, 0);

      const pixelatedUrl = canvas.toDataURL("image/png");
      setPixelatedImage(pixelatedUrl);
      setInPixelation(false);
    };
  };
  return {
    t,
    extendMode,
    originalImage,
    inPixelation,
    pixelSize,
    pixelAlgorithm,
    pixelAlgorithmOptions,
    paletteName,
    handleImageChange,
    handlePixelate,
    handleChangePixelSize,
    handlePixelAlgorithmChange,
    handlePaletteChange,
  };
};

export default useControlPanel;
