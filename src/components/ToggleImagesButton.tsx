// components/ToggleImagesButton.tsx
import { IconButton } from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";

export const ToggleImagesButton: React.FC = () => {
  const [imagesHidden, setImagesHidden] = useState(false);

  useEffect(() => {
    // Применяем стили ко всем изображениям
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (imagesHidden) {
        img.style.setProperty('display', 'none', 'important');
      } else {
        img.style.removeProperty('display');
      }
    });

    // Также можно применить к другим элементам с изображениями
    const bgElements = document.querySelectorAll('[style*="background-image"]');
    bgElements.forEach(el => {
      if (imagesHidden) {
        el.style.setProperty('background-image', 'none', 'important');
      } else {
        // Восстанавливаем оригинальное background-image если нужно
        const originalBg = el.getAttribute('data-original-bg');
        if (originalBg) {
          el.style.setProperty('background-image', originalBg, 'important');
        }
      }
    });
  }, [imagesHidden]);

  const toggleImages = () => {
    setImagesHidden(prev => !prev);
  };

  return (
    <IconButton
      icon={imagesHidden ? <FaEyeSlash /> : <FaEye />}
      onClick={toggleImages}
      aria-label={imagesHidden ? "Показать изображения" : "Скрыть изображения"}
      title="Версия для слабовидящих"
      variant="ghost"
      size="sm"
    />
  );
};